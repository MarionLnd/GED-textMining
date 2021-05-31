<template>
	<div class="table-responsive">
		<h2>Liste des PDFs</h2>

		<table class="table table-bordered table-striped">
			<thead>
				<tr>
					<th>Titre</th>
					<th>Date</th>
					<th>Auteur</th>
					<th colspan="2">
						<div class="input-group">
							<select v-model="searchCriteria">
								<option disabled value="">Critère</option>
								<option v-for="(criteria, key) of searchCriterias" :key="key" :value="criteria.value">
									{{ criteria.name }}
								</option>
							</select>
							<input
								type="search"
								class="form-control rounded"
								placeholder="Rechercher un document"
								aria-label="Search"
								aria-describedby="search-addon"
								v-model.trim="searchQuery"
							/>
							<button type="button" class="btn btn-outline-success" @click.prevent="searchDocument"><font-awesome-icon icon="search" /></button>
						</div>
						<div class="info-tip" v-if="searchCriteria === 'keywords'">
							<font-awesome-icon icon="info-circle" class="mr-2" />
							<small>Veuillez entrer les différents mots clés séparés d'une virgule</small>
						</div>
						<!--button type="button" class="btn btn-secondary btn-lg">Elastic Search</button-->
					</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="item in moduleDa" :key="item.id_document">
					<td>
						{{ item.filename }}
					</td>
					<td>{{ formater(item.creation_date) }}</td>
					<td>{{ item.author }}</td>
					<td>
						<font-awesome-icon icon="edit" @click="setCookie(item.id_document)" />
					</td>
					<td @click="supprimer(item.id_document, item.delete_rule)">delete</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<style scoped>
@import "https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css";

h2 {
	font-family: Georgia, serif;
	font-size: 40px;
	font-weight: bold;
	margin-top: 50px;
	color: #55608f;
}
table {
	width: 90%;
	margin-left: 5%;
	border-collapse: collapse;
	overflow: hidden;
	margin-top: 30px;
}

td,
th {
	padding: 15px;
}

th {
	text-align: center;
	cursor: pointer;
	background-color: #55608f;
	color: #eee;
}

tbody td {
	position: relative;
	cursor: pointer;
}

a {
	text-decoration: none;
	color: white;
}
tbody tr:hover {
	background-color: rgba(255, 255, 255, 0);
}

select {
	font-size: 0.9rem;
	text-align: center;
	border-radius: 0.2rem;
}

.info-tip {
	display: flex;
	justify-content: center;
	align-content: center;
	margin-left: auto;
	margin-right: auto;
	margin-top: 0.4rem;
	padding: 0.3rem;
}
</style>

<script>
import axios from "axios";
import moment from "moment";

export default {
	name: "folder",
	data() {
		return {
			moduleDa: [],
			searchCriterias: [
				{ value: "author", name: "Auteur" },
				{ value: "title", name: "Titre" },
				{ value: "creation_date", name: "Date de création" },
				{ value: "keywords", name: "Mots clés" },
			],
			searchCriteria: "",
			searchQuery: "",
		};
	},

	mounted() {
		this.moduleDa = [];
		axios.get("http://localhost:30001/documents").then((response) => {
			console.log(response);

			response.data.forEach((doc) => {
				console.log(response.data);

				axios.get("http://localhost:30001/rules").then((rule) => {
					rule.data.forEach((element) => {
						if (doc.id_rule === element.id_rule) {
							var deleteDate = new Date(this.formater(doc.creation_date));
							deleteDate.setMonth(deleteDate.getMonth() + element.delete_time);
							var archiveDate = new Date(this.formater(doc.creation_date));
							// console.log(moment(test).format("YYYY-MM-DD"))
							archiveDate.setMonth(archiveDate.getMonth() + element.archive_time);
							var dateA = new Date();
							console.log(
								moment(dateA)
									.format("YYYY-MM-DD")
									.toString()
							);
							//  console.log(moment(test).format("YYYY-MM-DD"))

							//  console.log(moment(test).format("YYYY-MM-DD") > moment(dateA).format("YYYY-MM-DD"))
							if (
								moment(archiveDate).format("YYYY-MM-DD") > moment(dateA).format("YYYY-MM-DD") === true ||
								moment(deleteDate).format("YYYY-MM-DD") > moment(dateA).format("YYYY-MM-DD") === true
							) {
								this.moduleDa.push({
									id_document: doc.id_document,
									filename: doc.filename,
									title: doc.title,
									creation_date: doc.creation_date,
									modification_date: doc.modification_date,
									author: doc.author,
									delete_rule: element.delete_rule,
									delete_time: deleteDate,
								});
							}
							console.log(this.moduleDa);
						}
						//this.data = response.data.data;
					});
				});
			});
		});
	},
	methods: {
		setCookie(id_doc) {
			console.log(id_doc);
			console.log("okaaay");
			this.$cookies.set("id_doc", id_doc);
			this.$router.push("/folderEdit");
		},
		supprimer(id_doc, rule) {
			if (rule === 1) {
				axios
					.delete("http://localhost:30001/document/" + id_doc)
					.then((response) => {
						console.log(response);
						window.location.reload();
					})
					.catch((error) => console.log(error));
			}
		},
		formater(date) {
			return date.substring(0, 10);
			//console.log(date.substring(0, 10).getMonth())
		},
		searchDocument() {
			let previousDocumentsList = this.moduleDa;
			console.log(previousDocumentsList);

			if (this.searchQuery !== "") {
				switch (this.searchCriteria) {
					case "author":
						this.searchByAuthor(this.searchQuery);
						break;
					case "title":
						this.searchByTitle(this.searchQuery);
						break;
					case "creation_date":
						this.searchByDate(this.searchQuery);
						break;
					case "keywords":
						this.searchByKeywords(this.searchQuery);
						break;
					default:
						console.log("Pas de recherche");
						this.moduleDa = previousDocumentsList;
				}
			} else {
				console.log(previousDocumentsList);
				this.moduleDa = previousDocumentsList;
			}
		},
		searchByAuthor(searchQuery) {
			this.moduleDa = [];
			axios
				.post("http://localhost:9200/ged-document/_search/", {
					query: {
						match: {
							author: searchQuery,
						},
					},
				})
				.then((result) => {
					console.log(result.data);
					console.log(result.data.hits.hits);
					result.data.hits.hits.forEach((entry) => {
						console.log(entry);
						this.moduleDa.push(entry._source);
					});
					//this.moduleDa = result.data.hits.hits._source;
				})
				.catch((error) => {
					console.error(`Echec AXIOS : ${error}`);
				});
		},
		searchByTitle(searchQuery) {
			axios
				.post("http://localhost:9200/ged-document/_search/", {
					query: {
						match: {
							title: searchQuery,
						},
					},
				})
				.then((result) => {
					console.log(result.data);
				})
				.catch((error) => {
					console.error(`Echec AXIOS : ${error}`);
				});
		},
		searchByDate(searchQuery) {
			axios
				.post("http://localhost:9200/ged-document/_search/", {
					query: {
						match: {
							creation_date: searchQuery,
						},
					},
				})
				.then((result) => {
					console.log(result.data);
				})
				.catch((error) => {
					console.error(`Echec AXIOS : ${error}`);
				});
		},
		searchByKeywords(searchQuery) {
			axios
				.post("http://localhost:9200/ged-document/_search/", {
					query: {
						match: {
							keywords: searchQuery,
						},
					},
				})
				.then((result) => {
					console.log(result.data);
				})
				.catch((error) => {
					console.error(`Echec AXIOS : ${error}`);
				});
		},
	},
};
</script>
