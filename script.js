// ==========================================
// ⚙️ COURSE DATA
// ==========================================
const courseData = [
    { id: 1, module: "Social Media Impact on Youth", type: "Video", title: "Impact on Youth: Part 1", duration: "12 min" },
    { id: 2, module: "Social Media Impact on Youth", type: "Video", title: "Impact on Youth: Part 2", duration: "18 min" },
    { id: 3, module: "Social Media Impact on Youth", type: "Reading", title: "Negative Impact on Teen Health", duration: "1h 15m" },
    { id: 4, module: "Misinformation: Politically-related", type: "Video", title: "Instances: Part 1", duration: "16 min" },
    { id: 5, module: "Misinformation: Politically-related", type: "Reading", title: "Google Maps and Disputed Territory", duration: "7 min" },
    { id: 6, module: "Review and Reflect", type: "Assignment", title: "Module 1 & 2 Review", duration: "1h" }
];

const TOTAL_LESSONS = courseData.length;
let completedLessons = JSON.parse(localStorage.getItem('completedLessons')) || [];
let currentLessonId = parseInt(localStorage.getItem('currentLesson')) || 1;

// ==========================================
// 🚀 CORE NAVIGATION LOGIC
// ==========================================

function startCourse() {
    let name = localStorage.getItem('studentName');
    
    if (!name) {
        const inputField = document.getElementById('studentName');
        if (inputField) name = inputField.value;
    }

    if (!name || name.trim() === "") {
        alert("Please enter your name to start the course!");
        return;
    }

    localStorage.setItem('studentName', name);
    window.location.href = 'course.html';
}

function clearProgress() {
    if(confirm("This will erase all progress. Are you sure?")) {
        localStorage.clear();
        window.location.href = 'index.html';
    }
}

function showLesson(id) {
    currentLessonId = id;
    localStorage.setItem('currentLesson', currentLessonId);

    document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
    
    const targetSection = document.getElementById(`lesson-${id}`);
    if (targetSection) targetSection.classList.add('active');

    updateUI();
}

function markComplete(id) {
    if (!completedLessons.includes(id)) {
        completedLessons.push(id);
        localStorage.setItem('completedLessons', JSON.stringify(completedLessons));
    }
    
    let progress = Math.round((completedLessons.length / TOTAL_LESSONS) * 100);
    localStorage.setItem('courseProgress', progress);

    const nextId = id + 1;
    if (document.getElementById(`lesson-${nextId}`)) {
        showLesson(nextId);
    } else {
        window.location.href = 'certificate.html'; 
    }
}

// ==========================================
// 🎨 DYNAMIC UI GENERATOR
// ==========================================

function updateUI() {
    const progress = localStorage.getItem('courseProgress') || 0;
    const name = localStorage.getItem('studentName');

    // 🏠 HOMEPAGE LOGIC
    if (document.getElementById('mainCircle')) {
        document.getElementById('progressValue').innerText = progress + "%";
        document.getElementById('mainCircle').style.background = `conic-gradient(var(--primary) ${progress * 3.6}deg, var(--bg) 0deg)`;
        
        if (name) {
            document.getElementById('welcomeText').innerHTML = `👋 Welcome back, <span class="highlight-name">${name}</span>!`;
            document.getElementById('studentBox').style.display = "none";
            document.getElementById('startBtn').innerText = "Continue Course";
        } else {
            document.getElementById('welcomeText').innerHTML = `👋 Welcome, Student!`;
            document.getElementById('studentBox').style.display = "block";
            document.getElementById('startBtn').innerText = "Start Course";
        }
    }

    // 📚 COURSE PAGE LOGIC
    if (document.getElementById('miniProgressBar')) {
        document.getElementById('miniProgressBar').style.width = progress + "%";
        document.getElementById('miniProgressText').innerText = progress + "%";
        
        if (name && document.getElementById('navAvatar')) {
            document.getElementById('navAvatar').innerText = name.charAt(0).toUpperCase();
        }
    }

    const sidebar = document.getElementById('dynamic-sidebar');
    if (sidebar && window.location.pathname.includes('course.html')) {
        let sidebarHTML = '';
        let currentModuleTracker = '';
        let currentTypeTracker = '';
        let moduleCounter = 0; 

        courseData.forEach((item) => {
            if (item.module !== currentModuleTracker) {
                moduleCounter++;
                if (moduleCounter > 1) sidebarHTML += `<div class="module-divider"></div>`;
                sidebarHTML += `<div class="module-header">Module ${moduleCounter}: ${item.module}</div>`;
                currentModuleTracker = item.module;
                currentTypeTracker = ''; 
            }

            if (item.type !== currentTypeTracker) {
                sidebarHTML += `<div class="section-title">${item.type}s</div>`;
                currentTypeTracker = item.type;
            }

            const isActive = currentLessonId === item.id ? 'active-sidebar' : '';
            const isCompleted = completedLessons.includes(item.id) ? 'completed-lesson' : '';
            let icon = item.type === 'Reading' ? '📖' : (item.type === 'Assignment' ? '📝' : '▶️');
            
            sidebarHTML += `
                <button class="sidebar-item ${isActive} ${isCompleted}" onclick="showLesson(${item.id})">
                    <span class="sidebar-item-icon">${icon}</span>
                    <span class="sidebar-item-title">${item.title}</span>
                </button>
            `;
        });

        sidebarHTML += `<button class="btn btn-restart" onclick="clearProgress()">Restart Course</button>`;
        sidebar.innerHTML = sidebarHTML;
    }
}

window.addEventListener('DOMContentLoaded', () => {
    updateUI();
    if (window.location.pathname.includes('course.html')) {
        showLesson(currentLessonId); 
    }
});
