<template>
	<div class="container">
		<h2>Modifier/Ajouter les métadonnées</h2>
		<div class="card">
			<form>
				<div v-for="info in documentData" :key="info">
					<div class="form-group">
						<label>Nom de fichier</label>
						<input type="text" class="form-control" aria-describedby="emailHelp" id="filename" :value="[[info.filename]]" />
					</div>
					<div class="form-group">
						<label>Titre</label>
						<input type="text" class="form-control" aria-describedby="emailHelp" :value="[[info.title]]" id="title" />
					</div>
					<div class="form-group">
						<label>Date de creation</label>
						<input type="text" class="form-control" aria-describedby="emailHelp" :value="[[info.creation_date]]" id="dateC" />
					</div>
					<div class="form-group">
						<label>Date de modification</label>
						<input type="text" class="form-control" aria-describedby="emailHelp" :value="[[info.modification_date]]" id="dateM" />
					</div>
					<div class="form-group">
						<label>Auteur</label>
						<input type="text" class="form-control" aria-describedby="emailHelp" :value="[[info.author]]" id="auteur" />
					</div>

					<div class="form-group">
						<label>Mots clés</label>
						<input
							type="text"
							class="form-control"
							aria-describedby="emailHelp"
							placeholder="Entrez les mots clés séparés d'une virgule (mot1, mot2, etc.)"
							id="keyword"
						/>
					</div>
					<div class="form-group">
						<div style="width: 300px">
							<input type="checkbox" id="archive" checked v-if="info.archive_rule === 1" @click="getVal()" />

							<input type="checkbox" id="archive" v-if="info.archive_rule === 0" @click="getVal()" />
							<label for="archive">archivé</label>

							<input type="checkbox" id="supprimer" checked v-if="info.delete_rule === 1" @click="getVal()" />

							<input type="checkbox" id="supprimer" v-if="info.delete_rule === 0" @click="getVal()" />

							<label for="supprimer">supprimé</label>
						</div>
					</div>

					<div class="form-group" v-if="aff">
						<select class="form-control" id="rule">
							<option selected disabled :value="info.id_rule">{{ info.description }}</option>
							<option v-for="rule in rules" :key="rule" :value="rule.id_rule">
								{{ rule.description }}
							</option>
						</select>
					</div>
					<div class="form-group" v-if="archive">
						<h5>arch</h5>
						<select class="form-control" id="rule">
							<option v-for="rule in archiveRule" :key="rule">
								{{ rule.description }}
							</option>
						</select>
					</div>
					<div class="form-group" v-if="supp">
						<h5>supp</h5>
						<select class="form-control" id="rule">
							<option v-for="rule in deleteRule" :key="rule" :value="rule.id_rule">
								{{ rule.description }}
							</option>
						</select>
					</div>
					<div class="form-group">
						<input type="submit" @click="update()" value="Modifier" />
					</div>
				</div>
			</form>
		</div>
	</div>
</template>

<style>
.card {
	background-color: #adc5da;
}
</style>

<script>
import axios from "axios";
import moment from "moment";
export default {
	name: "folder",
	data() {
		return {
			documentData: [],
			//  categories: [],
			rules: [],
			all: [],
			archiveRule: [],
			deleteRule: [],
			aff: false,
			archive: false,
			supp: false,
			sendForm: false,
		};
	},
	mounted() {
		//GET RULES
		axios.get("http://localhost:30001/rules").then((rule) => {
			rule.data.forEach((element) => {
				this.all.push({
					id_rule: element.id_rule,
					archive_time: element.archive_time,
					delete_time: element.delete_time,
					archive_rule: element.archive_rule,
					delete_rule: element.delete_rule,
					description: element.details,
				});
				if (element.archive_rule === 1 && element.delete_rule === 1) {
					this.rules.push({
						id_rule: element.id_rule,
						archive_time: element.archive_time,
						delete_time: element.delete_time,
						archive_rule: element.archive_rule,
						delete_rule: element.delete_rule,
						description: element.details,
					});
				}
				if (element.archive_rule === 1 && element.delete_rule === 0) {
					this.archiveRule.push({
						id_rule: element.id_rule,
						archive_time: element.archive_time,
						delete_time: element.delete_time,
						archive_rule: element.archive_rule,
						delete_rule: element.delete_rule,
						description: element.details,
					});
				}
				if (element.archive_rule === 0 && element.delete_rule === 1) {
					this.deleteRule.push({
						id_rule: element.id_rule,
						archive_time: element.archive_time,
						delete_time: element.delete_time,
						archive_rule: element.archive_rule,
						delete_rule: element.delete_rule,
						description: element.details,
					});
				}
			});
		});
		// GET METADATA OF DOCUMENT
		axios.get("http://localhost:30001/document/" + this.$cookies.get("id_doc")).then((response) => {
			// console.log(this.rules);
			this.all.forEach((element) => {
				if (response.data[0].id_rule === element.id_rule) {
					this.documentData.push({
						filename: response.data[0].filename,
						title: response.data[0].title,
						creation_date: moment(response.data[0].creation_date).format("YYYY-MM-DD"),
						modification_date: moment(response.data[0].modification_date).format("YYYY-MM-DD"),
						author: response.data[0].author,
						id_rule: element.id_rule,
						archive_time: element.archive_time,
						delete_time: element.delete_time,
						archive_rule: element.archive_rule,
						delete_rule: element.delete_rule,
						description: element.description,
					});
				}
			});

			this.documentData.forEach((data) => {
				console.log(data);
				if (data.delete_rule === 1 && data.archive_rule === 1) {
					this.aff = true;
				}
				if (data.delete_rule === 1 && data.archive_rule === 0) {
					this.supp = true;
				}
				if (data.delete_rule === 0 && data.archive_rule === 1) {
					this.archive = true;
				}
			});
		});
	},
	methods: {
		update() {
			var date = new Date();

			axios
				.put("http://localhost:30001/documentUpdate/" + this.$cookies.get("id_doc"), {
					filename: document.getElementById("filename").value,
					title: document.getElementById("title").value,
					creation_date: document.getElementById("dateC").value,
					modification_date: moment(date)
						.format("YYYY-MM-DD")
						.toString(),
					author: document.getElementById("auteur").value,
					id_rule: document.getElementById("rule").value,
				})
				.then(function(response) {
					console.log(response);
					this.sendForm = true;
				});
		},
		getVal() {
			if (document.getElementById("supprimer").checked) {
				this.supp = true;
				this.archive = false;
				this.aff = false;
			}
			if (document.getElementById("archive").checked) {
				this.archive = true;
				this.supp = false;
				this.aff = false;
			}

			if (document.getElementById("archive").checked && document.getElementById("supprimer").checked) {
				this.aff = true;
				this.supp = false;
				this.archive = false;
			}
			if (!document.getElementById("archive").checked && !document.getElementById("supprimer").checked) {
				this.aff = false;
				this.supp = false;
				this.archive = false;
			}
		},
	},
};
</script>
