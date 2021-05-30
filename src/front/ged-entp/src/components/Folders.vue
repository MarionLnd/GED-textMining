<template>
  <div class="table-responsive">
    <!-- navbar with links to others pages-->

    <h2>Liste des PDFs</h2>

    <table class="table table-bordered table-striped">
      <thead>
        <tr>
          <th>titre</th>
          <th>date</th>
          <th>auteur</th>
          <th colspan="2">
            <div class="input-group">
              <input
                type="search"
                class="form-control rounded"
                placeholder="Search"
                aria-label="Search"
                aria-describedby="search-addon"
              />
              <button type="button" class="btn btn-outline-secondary">
                search
              </button>
            </div>
            <!--button type="button" class="btn btn-secondary btn-lg">Elastic Search</button-->
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in moduleDa" :key="item">
          <td>
            {{ item.filename }}
          </td>
          <td>{{ formater(item.creation_date) }}</td>
          <td>{{ item.author }}</td>
          <td>
            <font-awesome-icon
              icon="edit"
              @click="setCookie(item.id_document)"
            />
          </td>
          <td><font-awesome-icon icon="trashAlt" /></td>
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
@media only screen and (max-width: 760px),
  (min-device-width: 768px) and (max-device-width: 1024px) {
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
import moment from "moment";

export default {
  name: "folder",
  data() {
    return {
      moduleDa: [],
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
              // console.log(this.formater(doc.creation_date))
              var test = new Date(this.formater(doc.creation_date));
              // console.log(moment(test).format("YYYY-MM-DD"))
              test.setMonth(test.getMonth() + element.archive_time);
              var dateA = new Date();
              //  console.log(moment(test).format("YYYY-MM-DD"))

              //  console.log(moment(test).format("YYYY-MM-DD") > moment(dateA).format("YYYY-MM-DD"))
              if (
                moment(test).format("YYYY-MM-DD") >
                  moment(dateA).format("YYYY-MM-DD") ===
                true
              ) {
                console.log("yes");

                this.moduleDa.push({
                  filename: doc.filename,
                  title: doc.title,
                  creation_date: doc.creation_date,
                  modification_date: doc.modification_date,
                  author: doc.author,
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
    formater(date) {
      return date.substring(0, 10);
      //console.log(date.substring(0, 10).getMonth())
    },
  },
};
</script>