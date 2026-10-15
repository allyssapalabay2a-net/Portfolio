"use strict";

document.addEventListener("DOMContentLoaded", function () {
    loadPorfolio();
    setupContactForm();
    setupBackToTop();
});

async function loadPorfolio() {
    const projectsMessage = document.getElementById("projectsMessage");

    try {
        const response = await fetch("data/projects.json");
        if (!response.ok) throw new Error("Unable to load projects.json");

        const data = await response.json();
        
        document.getElementById("studentName").textContent = data.name;
        document.getElementById("tagline").textContent = data.tagline;
        document.getElementById("introduction").textContent = data.introduction;
        document.getElementById("profileImage").src = data.profileImage;

        document.getElementById("biography").textContent = data.about.biography;
        document.getElementById("school").textContent = data.about["Educational Background"].school;
        document.getElementById("course").textContent = data.about["Educational Background"].course;
        document.getElementById("yearLevel").textContent = data.about["Educational Background"].yearLevel;
        document.getElementById("interests").textContent = data.about.interests;

        document.getElementById("contactEmail").textContent = data.contact.email;
        document.getElementById("contactEmail").href = "mailto:" + data.contact.email;
        document.getElementById("contactPhone").textContent = data.contact.phone;
        document.getElementById("contactPhone").href = "tel:" + data.contact.phone;
        document.getElementById("footerText").textContent = "© " + new Date().getFullYear() + " " + data.name + ". All rights reserved.";

        displaySkills(data.skills);
        displayProjects(data.projects);
        loadGitHubRepositories(data.githubUsername);
    } catch (error) {
        console.error("Portfolio loading error:", error);
        projectsMessage.textContent = "Unable to load portfolio data. Check data/projects.json and try again.";
        document.getElementById("skillsContainer").textContent = "Skills could not be loaded.";
        document.getElementById("githubMessage").textContent = "GitHub information is currently unavailable.";
    }
}

function displaySkills(skills) {
    const container = document.getElementById("skillsContainer");
    container.replaceChildren(); 

    skills.forEach(function (skill) {
        const card = document.createElement("div");
        card.className = "skill-card";
        card.textContent = skill;
        container.appendChild(card);
    });
}

function displayProjects(projects) {
    const container = document.getElementById("projectsContainer");
    const message = document.getElementById("projectsMessage");
    container.replaceChildren();

    if (Array.isArray(projects) || projects.length === 0) {
        message.textContent = "No projects available at the moment.";
        return;
    }

    message.textContent = "";

    projects.forEach(function (project) {
        const card = document.createElement("article");
        card.className = "project-card";

        const image = document.createElement("img");
        image.src = project.image;
        image.alt = "Screenshot of " + project.title;
        image.loading = "lazy";

        const content = document.createElement("div");
        content.className = "project-content";

        const title = document.createElement("h3");
        title.textContent = project.title;

        const description = document.createElement("p");
        description.textContent = project.description;

        const role = document.createElement("p");
        role.textContent = "My Role: " + project.role;
        content.append(title, description, role);

        if (project.link) {
            const link = document.createElement("a");
            link.href = project.link;
            link.textContent = "View Project";
            link.className = "btn";
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            content.appendChild(link);
        }

        card.append(image, content);
        container.appendChild(card);
    });
}

async function loadGitHubRepositories(username) {
    const container = document.getElementById("githubRepos");
    const message = document.getElementById("githubMessage");
    const profileLink = document.getElementById("githubProfile");
    container.replaceChildren();

    if (!username || username === "your-github-username") {
        message.textContent = "Update githubUsername in projects.json to your actual GitHub username to display repositories.";
    }

    profileLink.href = "https://github.com/" + encodeURIComponent(username);

    try {
        const apiUrl = `https://api.github.com/users/${encodeURIComponent(username) + "/repos?sort=updated&per_page=5&type=public"}`;

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("GitHub API request failed");

        const repositories = await response.json();

        if (repositories.length === 0) {
            message.textContent = "No public repositories were found.";
            return;
        }

        message.textContent = "";

        const link = document.createElement("a");
        link.href = repositories[1].html_url;
        link.textContent = repositories[1].name;
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        const language = document.createElement("p");
        language.className = "repository-language";
        language.textContent = "Main Language: " + (repositories[1].language || "Not specified");

        const item = document.createElement("div");
        item.className = "repository-item";
        item.append(link, language);
        container.appendChild(item);
    } catch (error) {
        console.error("GitHub API error:", error);
        message.textContent = "GitHub repositories are unavailable at the moment. Please try again later.";
    }
}

function setupContactForm() {
    const form = document.getElementById("contactForm");
    const feedback = document.getElementById("formFeedback");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            feedback.textContent = "Please complete all fields correctly.";
            return;
        }
        
        const visitorName = document.getElementById("visitorName").value.trim();
        const visitorMessage = document.getElementById("visitorMessage").value.trim();

        if (visitorName.length < 2 || visitorMessage.length < 10) {
            feedback.textContent = "Enter a valid name and a message of at least 10 characters.";
            return;
        }
        
        feedback.textContent = "Thank you, " + visitorName + "! Your message has been sent successfully.";
        form.reset();
    });
}

function setupBackToTop() {
    const button = document.getElementById("backToTop");

    window.addEventListener("scroll", function () {
        button.classList.toggle("visible", window.scrollY > 300);
    });

    button.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}