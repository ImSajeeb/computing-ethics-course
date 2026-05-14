// ALL lecture checkboxes
const checkboxes =
document.querySelectorAll('.lecture-checkbox');

// Progress bar
const progressBar =
document.getElementById('courseProgress');

const progressText =
document.getElementById('progressText');

// Load saved progress
window.addEventListener('DOMContentLoaded', () => {

    const savedProgress =
    localStorage.getItem('courseProgress');

    if(progressBar && savedProgress){

        progressBar.value = savedProgress;

        progressText.innerText =
        `${savedProgress}% Completed`;
    }

    checkboxes.forEach((checkbox) => {

        const lectureId =
        checkbox.dataset.lecture;

        const savedState =
        localStorage.getItem(lectureId);

        if(savedState === 'true'){
            checkbox.checked = true;
        }

        checkbox.addEventListener('change', () => {

            localStorage.setItem(
                lectureId,
                checkbox.checked
            );

            updateProgress();

        });

    });

    updateProgress();

});

// UPDATE PROGRESS
function updateProgress(){

    const totalLectures =
    checkboxes.length;

    let completedLectures = 0;

    checkboxes.forEach((checkbox) => {

        if(checkbox.checked){
            completedLectures++;
        }

    });

    const progressPercent =
    Math.round(
        (completedLectures / totalLectures) * 100
    );

    if(progressBar){
        progressBar.value = progressPercent;
    }

    if(progressText){

        progressText.innerText =
        `${progressPercent}% Completed`;

    }

    localStorage.setItem(
        'courseProgress',
        progressPercent
    );
}
