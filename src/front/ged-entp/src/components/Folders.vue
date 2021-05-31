<template>
	<div class="table-responsive">
		<h2>Liste des PDFs</h2>

		<table class="table table-bordered table-striped">
			<thead>
				<tr>
					<th>Nom du fichier</th>
					<th>Date</th>
					<th>Auteur</th>
					<th colspan="3">Actions</th>
				</tr>
				<tr>
					<th colspan="6">
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
								@keyup.enter="searchDocument"
								@change="resetSearchResult"
							/>
							<button type="button" class="btn btn-outline-success" @click.prevent="searchDocument"><font-awesome-icon icon="search" /></button>
						</div>
						<div class="info-tip" v-if="searchCriteria === 'keywords'">
							<font-awesome-icon icon="info-circle" class="mr-2" />
							<small>Veuillez entrer les différents mots clés séparés d'une virgule</small>
						</div>
					</th>
				</tr>
			</thead>
			<tbody v-if="searchQuery === ''">
				<tr v-for="item in moduleDa" :key="item.id_document">
					<td>
						{{ item.filename }}
					</td>
					<td>{{ formater(item.creation_date) }}</td>
					<td>{{ item.author }}</td>
					<td v-if="privilege === 'all'">
						<font-awesome-icon icon="edit" @click="setCookie(item.id_document)" />
					</td>
					<td v-if="privilege === 'update'">
						<font-awesome-icon icon="edit" @click="setCookie(item.id_document)" />
					</td>
					<td>
						<a :href="'http://localhost:30001/pdf?filename=' + item.filename" target="_blank">
							<font-awesome-icon icon="external-link-alt" />
							Consulter
						</a>
					</td>
					<td style="display: flex; flex-direction: column;" v-if="privilege === 'all'">
						<a @click="supprimer(item.id_document, item.delete_rule)" class="btn btn-outline-danger">
							Supprimer
						</a>
						<small class="text-danger">
							<font-awesome-icon icon="exclamation-triangle" @click="setCookie(item.id_document)" />
							Cette action est irréversible
						</small>
					</td>
				</tr>
			</tbody>
			<tbody v-else>
				<tr v-if="!isSearchButtonClicked && searchResult.length === 0">
					<td colspan="6">Loading..</td>
				</tr>
				<tr v-if="isSearchButtonClicked && searchCriteria === ''">
					<td colspan="6" class="bg-danger">Vous devez sélectionner un critère de recherche</td>
				</tr>
				<tr v-if="isSearchButtonClicked && searchResult.length === 0">
					<td colspan="6" class="bg-danger">Votre recherche ne correspond à aucun document présent sur l'entrepôt.</td>
				</tr>
				<tr v-for="item in searchResult" :key="item.id_document">
					<td>
						{{ item.filename }}
					</td>
					<td>{{ formater(item.creation_date) }}</td>
					<td>{{ item.author }}</td>
					<td>
						<font-awesome-icon icon="edit" @click="setCookie(item.id_document)" />
					</td>
					<td>
						<a :href="'http://localhost:30001/pdf?filename=' + item.filename" target="_blank">
							<font-awesome-icon icon="external-link-alt" />
							Consulter
						</a>
					</td>
					<td style="display: flex; flex-direction: column;">
						<a @click="supprimer(item.id_document, item.delete_rule)" class="btn btn-outline-danger">
							Supprimer
						</a>
						<small class="text-danger">
							<font-awesome-icon icon="exclamation-triangle" @click="setCookie(item.id_document)" />
							Cette action est irréversible
						</small>
					</td>
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
	vertical-align: baseline;
}

tr {
	border: 1px solid #dee2e6;
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
			searchResult: [],
			rules: [],
			searchCriterias: [
				{ value: "author", name: "Auteur" },
				{ value: "filename", name: "Nom du fichier" },
				{ value: "category", name: "Catégorie" },
				{ value: "keywords", name: "Mots clés" },
			],
			searchCriteria: "",
			searchQuery: "",
			isSearchButtonClicked: false,
			privilege: String
		};
	},
	created() {
		axios.get("http://localhost:30001/rules").then((response) => {
			response.data.forEach((rule) => this.rules.push(rule));
		});
	},
	mounted() {
		this.privilege = this.$cookies.get("privileges");
		console.log(this.privilege)
		this.moduleDa = [];
		axios.get("http://localhost:30001/documents").then((response) => {
			console.log(response.data);
			response.data.forEach((doc) => {
				let deleteDate, archiveDate, dateA;

				let rule = this.rules.filter((rule) => rule.id_rule === doc.id_rule)[0];
				if (this.rules.filter((rule) => rule.id_rule === doc.id_rule).length === 1) {
					deleteDate = new Date(this.formater(doc.creation_date));
					deleteDate.setMonth(deleteDate.getMonth() + rule.delete_time);
					archiveDate = new Date(this.formater(doc.creation_date));
					// console.log(moment(test).format("YYYY-MM-DD"))
					archiveDate.setMonth(archiveDate.getMonth() + rule.archive_time);
					dateA = new Date();
				}
				this.moduleDa.push({
					id_document: doc.id_document,
					filename: doc.filename,
					title: doc.title,
					creation_date: doc.creation_date,
					modification_date: doc.modification_date,
					author: doc.author,
					delete_rule: rule.delete_rule,
					delete_time:
						moment(archiveDate).format("YYYY-MM-DD") > moment(dateA).format("YYYY-MM-DD") === true ||
						moment(deleteDate).format("YYYY-MM-DD") > moment(dateA).format("YYYY-MM-DD") === true
							? deleteDate
							: "",
				});

				/*this.rules.forEach((element) => {
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
				});*/
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
					.delete("http://localhost:30001/deleteDocument/" + id_doc)
					.then((response) => {
						console.log(response);
						window.location.reload();
					})
					.catch((error) => console.log(error));

				axios
					.post("http://localhost:9200/ged-document/_delete_by_query", {
						query: {
							match: {
								id_document: id_doc,
							},
						},
					})
					.then((response) => console.log(response))
					.catch((err) => console.error(err));
			}
		},
		formater(date) {
			return date.substring(0, 10);
			//console.log(date.substring(0, 10).getMonth())
		},
		searchDocument() {
			this.isSearchButtonClicked = true;
			if (this.searchQuery !== "" && this.isSearchButtonClicked) {
				this.searchQuery = this.searchQuery.toLowerCase();
			
				switch (this.searchCriteria) {
					case "author":
						this.searchByAuthor(this.searchQuery);
						break;
					case "filename":
						this.searchByFilename(this.searchQuery);
						break;
					case "category":
						this.searchByCategory(this.searchQuery);
						break;
					case "keywords":
						this.searchByKeywords(this.searchQuery);
						break;
					default:
						console.log("Pas de recherche");
						this.searchResult = [];
				}
			} else {
				this.searchResult = [];
			}
		},
		searchByAuthor(searchQuery) {
			axios
				.post("http://localhost:9200/ged-document/_search/", {
					query: {
						wildcard: {
							author: `*${searchQuery.toLowerCase()}*`,
						},
					},
				})
				.then((result) => {
					result.data.hits.hits.forEach((entry) => {
						this.searchResult.push(entry._source);
						//this.isSearchButtonClicked = false;
					});
				})
				.catch((error) => {
					console.error(`Echec AXIOS : ${error}`);
				});

			if (this.searchResult.length === 0) {
				this.isSearchButtonClicked = false;
			}
			this.searchResult = [];
		},
		searchByFilename(searchQuery) {
			axios
				.post("http://localhost:9200/ged-document/_search/", {
					query: {
						wildcard: {
							filename: `*${searchQuery.toLowerCase()}*`,
						},
					},
				})
				.then((result) => {
					result.data.hits.hits.forEach((entry) => {
						this.searchResult.push(entry._source);
						//this.isSearchButtonClicked = false;
					});
				})
				.catch((error) => {
					console.error(`Echec AXIOS : ${error}`);
				});

			if (this.searchResult.length === 0) {
				this.isSearchButtonClicked = false;
			}
			this.searchResult = [];
		},
		searchByCategory(searchQuery) {
			axios
				.post("http://localhost:9200/ged-document/_search/", {
					query: {
						wildcard: {
							id_category: `*${searchQuery.toLowerCase()}*`,
						},
					},
				})
				.then((result) => {
					result.data.hits.hits.forEach((entry) => {
						this.searchResult.push(entry._source);
						//this.isSearchButtonClicked = false;
					});
				})
				.catch((error) => {
					console.error(`Echec AXIOS : ${error}`);
				});
			if (this.searchResult.length === 0) {
				this.isSearchButtonClicked = false;
			}
			this.searchResult = [];
		},
		searchByKeywords(searchQuery) {
			axios
				.post("http://localhost:9200/ged-document/_search/", {
					query: {
						wildcard: {
							keywords: `*${searchQuery.toLowerCase()}*`,
						},
					},
				})
				.then((result) => {
					result.data.hits.hits.forEach((entry) => {
						this.searchResult.push(entry._source);
						//this.isSearchButtonClicked = false;
					});
				})
				.catch((error) => {
					console.error(`Echec AXIOS : ${error}`);
				});
			if (this.searchResult.length === 0) {
				this.isSearchButtonClicked = false;
			}
			this.searchResult = [];
			//this.isSearchButtonClicked = false;
			//this.searchResult = [];
		},
		resetSearchResult() {
			if (this.searchQuery === "") {
				this.searchResult = [];
				this.isSearchButtonClicked = false;
			}
		},
	},
};
</script>
