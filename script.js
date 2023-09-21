// --- GLOBAL ----------------------------
const MAX_CHARS = 150;

const textareaEl = document.querySelector('.form__textarea');
const counterEl = document.querySelector('.counter');
const formEl = document.querySelector('.form');
const feedbackListEl = document.querySelector('.feedbacks');
const submintBtnEl = document.querySelector('.submit-btn');

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
    const feedbackItemHTML = `
        <li class="feedback">
            <button class="upvote">
                <i class="fa-solid fa-caret-up upvote__icon"></i>
                <span class="upvote__count">${upvoteCount}</span>
            </button>
            <section class="feedback__badge">
                <p class="feedback__letter">${badgeLetter}</p>
            </section>
            <div class="feedback__content">
                <p class="feedback__company">${company}</p>
                <p class="feedback__text">${text}</p>
            </div>
            <p class="feedback__date">${daysAgo === 0 ? 'NEW' : `${daysAgo}d`}</p>
        </li>
    `;
    // insert new feedback
    feedbackListEl.insertAdjacentHTML('beforeend', feedbackItemHTML);


    // clear text area
    textareaEl.value = '';
    //take out focus on submint button
    submintBtnEl.blur();
    // reset counter
    counterEl.textContent = MAX_CHARS;
}

formEl.addEventListener('submit', submitHandler);
