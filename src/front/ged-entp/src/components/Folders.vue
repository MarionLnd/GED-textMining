<template>
	<div class="table-responsive">
		<!-- navbar with links to others pages-->

		<h2>Liste des cours</h2>
		<table class="table table-bordered table-striped">
			<thead>
				<tr>
					<th>titre</th>
					<th>date</th>
					<th>auteur</th>
					<th>size</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="item in moduleData" :key="item">
					<td>
						{{ item.filename }}
					</td>
					<td>{{ format(item.creation_date) }}</td>
					<td>{{ item.author }}</td>
					<td>{{ item.size }}</td>
					<td><font-awesome-icon icon="edit" @click="setCookie(item.id_document)" /></td>
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

th,
td {
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
@media only screen and (max-width: 760px), (min-device-width: 768px) and (max-device-width: 1024px) {
	/* Force table to not be like tables anymore */
	table,
	thead,
	tbody,
	th,
	td,
	tr {
		display: block;
	}

	/* Hide table headers (but not display: none;, for accessibility) */
	thead tr {
		position: absolute;
		top: -9999px;
		left: -9999px;
	}

	tr {
		border: 2px solid #eee;
	}

	td {
		/* Behave  like a "row" */
		border: none;
		border-bottom: 1px solid #eee;
		position: relative;
		padding-left: 50%;
	}

	td:before {
		/* Now like a table header */
		position: absolute;
		/* Top/left values mimic padding */
		top: 6px;
		left: 6px;
		width: 45%;
		padding-right: 100%;
		white-space: nowrap;
	}

	/*
		Label the data
		*/

	td:nth-of-type(1):before {
		content: "Nom";
	}
	td:nth-of-type(2):before {
		content: "Prenom";
	}
	td:nth-of-type(3):before {
		content: "origine";
	}
	td:nth-of-type(4):before {
		content: "statut";
	}
	td:nth-of-type(5):before {
		content: "service statutaire";
	}
	td:nth-of-type(6):before {
		content: "service effectué";
	}
}
</style>

<script>
import axios from "axios";

export default {
	name: "folder",
	data() {
		return {
			moduleData: [],
		};
	},

	mounted() {
		axios.get("http://localhost:30001/documents").then((response) => {
			console.log(response);

			this.moduleData = response.data;
			//this.data = response.data.data;
			console.log(this.moduleData[0].filename);
		});

		axios
			.get("http://localhost:9200/ged-document/_search/")
			.then((response) => console.log(response.data))
			.catch((error) => console.error(error));
	},
	methods: {
		setCookie(id_doc) {
			console.log(id_doc);
			console.log("okaaay");
			this.$cookies.set("id_doc", id_doc);
			this.$router.push("/folderEdit");
		},
		format(date) {
			return date.substring(0, 10);
		},
	},
};
</script>
