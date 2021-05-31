import Login from "./components/Login.vue";
import Folders from "./components/Folders.vue";
import FolderEdit from "./components/FolderEdit.vue";

export default [
	{ path: "/", component: Login },

	{ path: "/folder", component: Folders },
	{ path: "/folderEdit", component: FolderEdit },
];
