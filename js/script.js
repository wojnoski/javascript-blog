const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  articleTag: Handlebars.compile(document.querySelector('#template-article-tag').innerHTML),
  articleAuthor: Handlebars.compile(document.querySelector('#template-article-author').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  AuthorsCloudLink: Handlebars.compile(document.querySelector('#template-authors-cloud-link').innerHTML)
}

'use strict';
const titleClickHandler = function(event){
  event.preventDefault();
  const clickedElement = this;

  console.log(event);
  console.log('clickedElement (with plus): ' + clickedElement);

    /* remove class 'active' from all article links  */
  
  const activeLinks = document.querySelectorAll('.titles a.active');

  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }

    /* add class 'active' to the clicked link */

  clickedElement.classList.add('active');
  console.log('clickedElement:', clickedElement);

    /* remove class 'active' from all articles */

  const activeArticles = document.querySelectorAll('.posts .active');

  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }

     /* get 'href' attribute from the clicked link */

  const articleSelector = clickedElement.getAttribute('href');
  console.log(articleSelector);

     /* find the correct article using the selector (value of 'href' attribute) */

  const targetArticle = document.querySelector(articleSelector);
  console.log(targetArticle);

    /* add class 'active' to the correct article */

  targetArticle.classList.add('active');
};

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optTagsListSelector = '.tags.list',
  optCloudClassCount = 5,
  optCloudClassPrefix = 'tag-size-',
  optAuthorsListSelector = '.authors';

function generateTitleLinks(customSelector = ''){

    /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  console.log('Title list: ', titleList);
         
  function clearTitleLinks(){
    titleList.innerHTML = '';
  }
  clearTitleLinks();

    /* for each article */
  const articles = document.querySelectorAll(optArticleSelector + customSelector);

  let html = '';

  for(let article of articles){
    article.addEventListener('click', generateTitleLinks);
    console.log(article);

     /* get the article id */
        
    const articleId = article.getAttribute('id');
    console.log(articleId);

     /* find the title element */

    const articleTitle = article.querySelector(optTitleSelector).innerHTML;

     /* get the title from the title element */

    console.log('Title: ',articleTitle);

      /* create HTML of the link */

    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
    console.log(linkHTML);

      /* insert link into titleList */
    html = html + linkHTML;
  }

  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');
  console.log(links);

           
  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
}
    
generateTitleLinks();

const optArticleTagSelector = '.post-tags .list';

function calculateTagsParams(tags){
  const params = {
    min: 0,
    max: 99999
  }
  for (let tag in tags){
    if (tags[tag]>params.max){
      params.min = tags[tag];
    }
    if(tags[tag]<params.min){
      params.min = tags[tag];
    }
    console.log(tag + ' is used ' + tags[tag] + ' times');
  }
  return params;
}
calculateTagsParams();

function calculateTagClass(count,params){
  console.log(count,params);
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );
  return classNumber;
}

function generateTags(){
  /* create a new variable allTags with an empty object */
  let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  /* START LOOP: for every article: */
  for(let article of articles){
    /* find tags wrapper */
    const articleList = article.querySelector(optArticleTagSelector);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    console.log("Article tag: ", articleTags);
    /* split tags into array */
    const articleTagsArray = articleTags.split('  ');
    console.log(articleTagsArray);
    /* START LOOP: for each tag */
    for (let tag of articleTagsArray){
      /* generate HTML of the link */
      const tagHTMLData = {id: tag, title: tag};
      const tagHTML = templates.articleTag(tagHTMLData);
      console.log(tagHTML);
      /* add generated code to html variable */
      html = html + tagHTML;
      /* check if this link is NOT already in allTags */
      if(!allTags[tag]){
        /* add generated code to allTags object */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
    /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    articleList.innerHTML = html;
  }
  /* END LOOP: for every article: */
  /* find list of tags in right column */
  const tagList = document.querySelector(optTagsListSelector);
  /* [NEW] create variable for all links HTML code */
  const tagsParams = calculateTagsParams(allTags);
  console.log('tagsParams: ', tagsParams);
  const allTagsData = {tags: []};
  /* START LOOP: for each tag in allTags */
  for (let tag in allTags){
    /* generate code of a link and add it to allTagsHTML */
    const tagLinkHTML = '<li><a class="'+ optCloudClassPrefix + calculateTagClass(allTags[tag], tagsParams) + '" href="#tag-' + tag+ '">' + tag + '</a> ('+ allTags[tag]+ ')</li>';
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });
  }
  /* END LOOP: for each tag in allTags */
  /* add HTML from allTagsHTML to tagList */
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
}

generateTags();

function tagClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  /* find all tag links with class active */
  const tagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
  /* START LOOP: for each active tag link */
  for (let link of tagLinks){
    /* remove class active */
    link.classList.remove('active');
    console.log('Active: ', clickedElement);
  }
  /* END LOOP: for each active tag link */
  /* find all tag links with "href" attribute equal to the "href" constant */
  const TagLinksHref = document.querySelectorAll('[href^="#tag-"]')
  /* START LOOP: for each found tag link */
  for (let linkHref of TagLinksHref){
    /* add class active */
    linkHref.classList.add('active');
  }
  /* END LOOP: for each found tag link */
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}
function addClickListenersToTags(){
  /* find all links to tags */
  const LinkTags = document.querySelectorAll('.list.list-horizontal a')
  /* START LOOP: for each link */
  for (let links of LinkTags){
    /* add tagClickHandler as event listener for that link */
    links.addEventListener('click', tagClickHandler);
  }
  /* END LOOP: for each link */
}
addClickListenersToTags();

const optArticleAuthorSelector = '.post .post-author';

function generateAuthors(){
  let allAuthors = {};
  console.log(allAuthors);
  const articles = document.querySelectorAll(optArticleSelector);
  for (let article of articles){
    let html = '';
    const authorList = article.querySelector(optArticleAuthorSelector);
    console.log(authorList);
    const AuthorName = article.getAttribute('data-author');
    console.log(AuthorName);
    const AuthorHTMLData = {id: AuthorName, title: AuthorName};
    const AuthorHTML = templates.articleAuthor(AuthorHTMLData);
    html = html + AuthorName;
    if(!allAuthors[authorName]){
      allAuthors[authorName] = 1;
    } else {
      allAuthors[authorName]++;
    }
    authorList.innerHTML = AuthorHTML;
    authorsList.innerHTML = allAuthors.join(' ');
  }
  const authorsList = document.querySelector(optAuthorsListSelector);
  const allAuthorsHTML = {authors: []};
  for (let author in allAuthors){
    allAuthorsHTML.authors.push({
      author: author,
      count: allAuthors[author],
    });
  }
  authorList.innerHTML = templates.AuthorsCloudLink(allAuthorsHTML);
  console.log(allAuthorsHTML);
}
generateAuthors();

function authorClickHandler(event){
  event.preventDefault();
  const clickedElement = this;
  console.log(clickedElement);
  const href = clickedElement.getAttribute('href');
  const tagAuthor = href.replace('#author-', '');
  const tagAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');
  console.log(tagAuthorLinks);
  for (let AuthorLink of tagAuthorLinks){
    AuthorLink.classList.remove('active');
  }
  const TagAuthorsHref = document.querySelectorAll('a[href^="#author-"]');
  for (let AuthorHref of TagAuthorsHref){
    AuthorHref.classList.add('active');
    console.log("Active: ", clickedElement);
  }
  generateTitleLinks('[data-author="' + tagAuthor + '"]');
}

function addClickListenersToAuthors(){
  const LinkAuthors = document.querySelectorAll('a[href^="#author-"]');
  for (let link of LinkAuthors){
    link.addEventListener('click', authorClickHandler);
  }
}
addClickListenersToAuthors();