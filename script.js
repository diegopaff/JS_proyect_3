// --- GLOBAL ----------------------------
const MAX_CHARS = 150;

const textareaEl = document.querySelector('.form__textarea');
const counterEl = document.querySelector('.counter');
const formEl = document.querySelector('.form');
const feedbackListEl = document.querySelector('.feedbacks');
const submintBtnEl = document.querySelector('.submit-btn');
const spinnerEl = document.querySelector('.spinner');

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
    fetch('https://bytegrad.com/course-assets/js/1/api/feedbacks', {
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
        
    })
    

    // clear text area
    textareaEl.value = '';
    //take out focus on submint button
    submintBtnEl.blur();
    // reset counter
    counterEl.textContent = MAX_CHARS;
}

formEl.addEventListener('submit', submitHandler);

// --- FEEDBACK LIST COMPONENT --------------------------

fetch('https://bytegrad.com/course-assets/js/1/api/feedbacks')
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
 