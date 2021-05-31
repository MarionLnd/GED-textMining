import Login from "./components/Login.vue";
import Folders from "./components/Folders.vue";
import FolderEdit from "./components/FolderEdit.vue";

export default [
	{ path: "/login", component: Login },

	{ path: "/folder", component: Folders },
	{ path: "/folderEdit", component: FolderEdit },
];
