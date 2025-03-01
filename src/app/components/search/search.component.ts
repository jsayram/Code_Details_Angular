import { Component, OnInit, HostListener, ElementRef} from '@angular/core';
import algoliasearch, { SearchIndex } from 'algoliasearch/lite';
import { environment } from 'src/environments/environment';
import { ModalService } from 'src/app/components/modal-w';
import { ChangeDetectorRef } from '@angular/core';

const searchClient = algoliasearch(
  environment.algolia.algoliaAPP_ID,
  environment.algolia.algoliaAdminAPI_KEY
);

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  /* pages created by for each of the links returned by the search */
  /* cant have two keys that are the same*/
  pagesCreated: {[key: string]: {link: string, title: string}} = {
    '/page1-python': { 
      link: '/page1-python', //links may change here but not in databse so we need to change them here
      title: 'Article1-forPython1-page'
    },
    '/PAGE4-MEME': {
      link: '/PAGE4-MEME',
      title: 'Page 4 - Meme(INSERTED TITLE)'
    },
    '/page1': {
      link: '/page1',
      title: 'Page-1linkPlaceHolder'
    },
    '/page2': {
      link: '/page2',
      title: 'Page-2linkPlaceHolder'
    },
    '/page3': {
      link: '/page3',
      title: 'Page-3linkPlaceHolder'
    },
    '/page4': {
      link: '/page4',
      title: 'Page-4linkPlaceHolder'
    },
    '/page5': {
      link: '/page5',
      title: 'Page-5linkPlaceHolder'
    }
  };


  constructor(private modalService: ModalService, private cd: ChangeDetectorRef, private myElement: ElementRef) {
    this.index = searchClient.initIndex('tutorialContent');
  }

  @HostListener('document:click', ['$event'])
  public documentClick(event: Event): void {
    if (!this.myElement.nativeElement.contains(event.target)) {
      this.hits = [];
    }
  }
  
  index: SearchIndex;
  hits: any[] = [];
  searchTerm!: string;
  searched!: boolean;
  showList = true;


  s: string = "INSIDE THE OPEN MODAL FUNCTION : ";
  
searchParameters = {
  hitsPerPage: 6, 
  attributesToHighlight: ['title', 'description', 'tags', 'url'], 
  attributesToSnippet: ['description:20'], 
  highlightPreTag: '<span class="highlight-container"><span class="highlight">',
  highlightPostTag: '</span></span>',
  removeStopWords: true, 
  //removewordsIfNoResults: 'allOptional',
};


  ngOnInit(): void {
  }
 ngAfterOnInt(): void {
 // this.cd.detectChanges();
 }

  // openModal(id: string) {
  //   console.log(this.s + id);
  //   this.modalService.open(id);
  // }

  // closeModal(id: string) {
  //   this.modalService.close(id); 
  // }

  onInput() {
    if (!this.searchTerm) {
      this.clearSearch();
      this.showList = false;
    }
  }

  hideList() {
    this.showList = false;
  }
  

  search() {
    // Removes trailing spaces
    let trimmedSearchTerm = this.searchTerm.trim();
    if (trimmedSearchTerm !== '') {
      this.index.search(trimmedSearchTerm, this.searchParameters)
        .then(({ hits }) => {
          if (hits.length === 0) { // No hits from Algolia
            this.searched = true;
           // this.searchLabels();  // dont delete this TODO , future search of pages content incse of no search results found
          } else {
            this.hits = hits;
            this.showList = true;
          //  this.cd.detectChanges();
          }
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      console.log("No search term provided.");
    }
  }
  
  searchLabels() {
    const elements = document.querySelectorAll('h1, h2, h3, h4, p');
    const matchedLabels: { label: string }[] = [];
  
    elements.forEach(element => {
      const elementContent = element.textContent || '';
  
      if (elementContent.toLowerCase().includes(this.searchTerm.trimEnd().toLowerCase())) {
        matchedLabels.push({ label: elementContent });
      }
    });
  
    this.hits = matchedLabels;
    //this.cd.detectChanges();
  }
  

  toggleCloseButton() {
    const closeButton = document.querySelector('.material-icons.close') as HTMLElement;
    const searchButton = document.querySelector('.material-icons.search-icon') as HTMLElement;

    if (this.searchTerm.trim() !== '') {
      closeButton.classList.remove('d-none');
      closeButton.classList.add('d-inline-block');
    } else {
      closeButton.classList.remove('d-inline-block');
      closeButton.classList.add('d-none');
      searchButton.classList.remove('d-none');
      searchButton.classList.add('d-inline-block');
    }
  }
  

  clearSearch() {
    this.searchTerm = '';
    this.hits = [];
    this.searched = false;
    this.showList = false;
    this.toggleCloseButton();
  }

  private previousPage: any;

  checkChange(page: any) {
    if (page !== this.previousPage) {
      console.log("No Key Found for: "+ page +" in pagesCreated");
      this.previousPage = page;
    }
  }

}
