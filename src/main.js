
import "../src/css/style.css";
import { fetchImages } from "./pixabay-api";
import {
  renderGallery,
  smoothScroll,
  showLoadingIndicator,
  hideLoadingIndicator,
  showErrorMessage,
  showPopupMessage,
} from "./render-functions";

let currentPage = 1;
let query = "";
let totalHits = 0;

// DOM Elements
const app = document.querySelector("#app");
app.innerHTML = `
  <div>
    <div class="card">
      <input 
        type="text" 
        id="search-input" 
        placeholder="Search images..." 
        class="search-input"
      />
      <button class="btn" id="search-btn">Search</button>
    </div>
    <ul id="gallery-container" class="gallery"></ul>
    <button class="btn load-more" id="load-more-btn" style="display: none;">Load More</button>
  </div>
`;

const searchBtn = document.querySelector("#search-btn");
const searchInput = document.querySelector("#search-input");
const galleryContainer = document.querySelector("#gallery-container");
const loadMoreBtn = document.querySelector("#load-more-btn");

const fetchAndRenderImages = async (isLoadMore = false) => {
  if (!query) return;

  if (!isLoadMore) {
    galleryContainer.innerHTML = "";
    currentPage = 1;
  }

  showLoadingIndicator(searchBtn);
  loadMoreBtn.style.display = "none";

  try {
    const data = await fetchImages(query, currentPage);
    totalHits = data.totalHits;

    if (data.hits.length === 0 && !isLoadMore) {
      showErrorMessage("Sorry, no images found. Please try again.");
    } else {
      renderGallery(data.hits, galleryContainer);

      if (currentPage * 15 >= totalHits) {
        loadMoreBtn.style.display = "none";
        showPopupMessage(
          "We're sorry, but you've reached the end of search results."
        );
      } else {
        loadMoreBtn.style.display = "block";
      }
    }
  } catch (error) {
    showErrorMessage("An error occurred while fetching images.");
  } finally {
    hideLoadingIndicator(searchBtn);
    currentPage++;
    if (isLoadMore) smoothScroll();
  }
};

// Event Listeners
searchBtn.addEventListener("click", () => {
  query = searchInput.value.trim();
  if (!query) {
    showErrorMessage("Please enter a search criteria!");
    return;
  }
  fetchAndRenderImages();
});

loadMoreBtn.addEventListener("click", () => fetchAndRenderImages(true));

