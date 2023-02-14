/*
document.getElementById('test-button').addEventListener('click', function(){
    const links = document.querySelectorAll('.titles a');
    console.log('links:', links);
  });
*/
{
    const titleClickHandler = function(event){
        const clickedElement = this;
        console.log(event);
        event.preventDefault();
    
        const activeLinks = document.querySelectorAll('.titles a.active');

        for(let activeLink of activeLinks){
            activeLink.classList.remove('active');
        }

        clickedElement.classList.add('active');
        console.log('clickedElement:', clickedElement);

        const activeArticles = document.querySelectorAll('.posts .active');

        for(let activeArticle of activeArticles){
            activeArticle.classList.remove('active');
        }

        const articleSelector = clickedElement.getAttribute('href');
        console.log(articleSelector);
    
        const targetArticle = document.querySelector(articleSelector);
        console.log(targetArticle);

        targetArticle.classList.add('active');
    }
    
    const links = document.querySelectorAll('.titles a');
    
    for(let link of links){
        link.addEventListener('click', titleClickHandler);
    }

    const optArticleSelector = '.post',
        optTitleSelector = '.post-title',
        optTitleListSelector = '.titles';
    
    function generateTitleLinks(){
        /* remove contents of titleList */
        const titleList = document.querySelector(optTitleListSelector);
        console.log('Title list:', titleList);
        function clearTitleLinks(){
            titleList.innerHTML = '';
        }
        clearTitleLinks();
        /* for each article */

            /* get the article id */

            /* find the title element */

            /* get the title from the title element */

            /* create HTML of the link */

            /* insert link into titleList */
    }
    generateTitleLinks();
}