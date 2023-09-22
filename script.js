// --- GLOBAL ----------------------------
const MAX_CHARS = 150;
const BASE_API_URL = 'https://bytegrad.com/course-assets/js/1/api';


//DOM elements
const textareaEl = document.querySelector('.form__textarea');
const counterEl = document.querySelector('.counter');
const formEl = document.querySelector('.form');
const feedbackListEl = document.querySelector('.feedbacks');
const submintBtnEl = document.querySelector('.submit-btn');
const spinnerEl = document.querySelector('.spinner');
const hashtagListEl = document.querySelector('.hashtags');

const renderFeedbackItem = (feedbackItem) => {
    //new feedback item HMTL 
    const feedbackItemHTML = `
        <li class="feedback">
            <button class="upvote">
                <i class="fa-solid fa-caret-up upvote__icon"></i>
                <span class="upvote__count">${feedbackItem.upvoteCount}</span>
            </button>
            <section class="feedback__badge">
                <p class="feedback__letter">${feedbackItem.badgeLetter}</p>
            </section>
            <div class="feedback__content">
                <p class="feedback__company">${feedbackItem.company}</p>
                <p class="feedback__text">${feedbackItem.text}</p>
            </div>
            <p class="feedback__date">${feedbackItem.daysAgo === 0 ? 'NEW' : `${feedbackItem.daysAgo}d`}</p>
        </li>
    `;
    // insert new feedback
    feedbackListEl.insertAdjacentHTML('beforeend', feedbackItemHTML);
}

// --- COUNTER COMPONENT -----------------
const inputHandler = () =>{ 
    counterEl.textContent = MAX_CHARS - textareaEl.value.length;
};

textareaEl.addEventListener('input', inputHandler);


// --- FORM COMPONENT --------------------
const showVisualIndicator = (type) => {
    //show valid indicator
    formEl.classList.add(`form--${type}`);

    setTimeout(() => {
        formEl.classList.remove(`form--${type}`);
    }, 2000 );
}

const submitHandler = (event) =>{
    //prevent default browser action
    event.preventDefault();
    const text = textareaEl.value

    //validate text --> more than 5 characters, contains at least one '#'
    if(text.includes('#') && text.length > 4){
        showVisualIndicator('valid');
    }else {
        showVisualIndicator('invalid');    

        textareaEl.focus();

        //stop the function
        return;
    }

    // extract info from the text --> company name, badgeLetter, up
    const hashtag = text.split(' ').find(word => word.includes('#'));
    const company = hashtag.substring(1);
    const badgeLetter = company[0].toUpperCase();
    const upvoteCount = 0;
    const daysAgo = 0;
    
    //new feedback item HMTL 
    const feedbackItem = {
        upvoteCount: upvoteCount,
        badgeLetter: badgeLetter,
        company: company,
        text: text,
        daysAgo: daysAgo
    }
    renderFeedbackItem(feedbackItem);

    // send feedback item to server
    fetch(`${BASE_API_URL}/feedbacks`, {
        method: 'POST',
        body: JSON.stringify(feedbackItem),
        headers:{
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(res => {
        if(!res.ok){
            console.log('Something went wrong');
            return;
        }
        
        console.log('Succesfully submitted');  
    }).catch(err => console.error(err));
    

    // clear text area
    textareaEl.value = '';
    //take out focus on submint button
    submintBtnEl.blur();
    // reset counter
    counterEl.textContent = MAX_CHARS;
}

formEl.addEventListener('submit', submitHandler);

// --- FEEDBACK LIST COMPONENT --------------------------
const clickHanlder = (event) => {
    // get clicked elemente
    const clickedEL = event.target;

    // determine if the client want to upvote or expand
    const upvoteIntention = clickedEL.className.includes('upvote');
    
    // run the logic for each
    if(upvoteIntention){
        //get the closest upvote button
        const upvoteBtnEl = clickedEL.closest('.upvote');
        //disable upvote button after 1 click
        upvoteBtnEl.disabled = true;

        //select the upvote count element within the upvote button
        const upvoteCountEl = upvoteBtnEl.querySelector('.upvote__count');
        let upvoteCount = +upvoteCountEl.textContent;
        // increment + 1 and set it in html
        upvoteCountEl.textContent = upvoteCount + 1;
    }else{
        //expand
        clickedEL.closest('.feedback').classList.toggle('feedback--expand');
    }

}
feedbackListEl.addEventListener('click', clickHanlder);
fetch(`${BASE_API_URL}/feedbacks`)
    .then(res => res.json())
    .then(data => {
        
        //remove loader spiner
        spinnerEl.remove();

        //print all data fetched for the server
        data.feedbacks.forEach((item)=>{
            renderFeedbackItem(item);
        })
    })
    .catch(error => {
        feedbackListEl.textContent = `Failed to fetch feedback items. Error message ${error}`
    })
 
// ---- HASHTAG LIST COMPONENT ------------------

const clickHashtagHandler = (event) => {
    // get the clicked element
    const clickedEl = event.target;

    // stop function if click happens outside
    if(clickedEl.className === 'hashtags') return;

    //extract company name
    const companyNameFromHashtag = clickedEl.textContent.substring(1).toLowerCase().trim();

    //iterate over each feedback item in the list
    feedbackListEl.childNodes.forEach(childNode => {
        // stop iteration if is text node
        if(childNode.nodeType === 3) return;

        // if si a html element extract the company Name
        const companyNameFromFeedbackItem = childNode.querySelector('.feedback__company').textContent.toLowerCase().trim();
        
        //remove feedback item from list if company names are not equal
        if(companyNameFromHashtag !== companyNameFromFeedbackItem){
            childNode.remove()
        }
    })
}
hashtagListEl.addEventListener('click', clickHashtagHandler);