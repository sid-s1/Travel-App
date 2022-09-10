import { renderSearch } from "./search.js"
import { layout } from "./layout.js";


export const renderPublicHomepage = () => {
    layout.reset();
    layout.publicHomepage();
    renderSearch();
}
