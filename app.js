// Demo Database
const DATABASE = [
    {
        id: 1,
        type: "Enterprise",
        industry: "AI & Technology",
        country: "Saudi Arabia",
        whatNeed: "Local Saudi Partner",
        whatOffer: "Technology, Market Access",
        dealSize: "5M",
        timeline: "Immediate",
        saudiReady: true
    },
    {
        id: 2,
        type: "Family Office",
        industry: "Finance & Investment",
        country: "UAE",
        whatNeed: "Investment Opportunities",
        whatOffer: "Capital",
        dealSize: "50M",
        timeline: "1–3 Months",
        saudiReady: true
    },
    {
        id: 3,
        type: "Startup",
        industry: "Renewable Energy",
        country: "UK",
        whatNeed: "Investor",
        whatOffer: "Projects, Technology",
        dealSize: "10M",
        timeline: "Immediate",
        saudiReady: false
    },
    {
        id: 4,
        type: "Enterprise",
        industry: "Healthcare",
        country: "Germany",
        whatNeed: "Local Saudi Partner",
        whatOffer: "Services, Technology",
        dealSize: "5M",
        timeline: "3–6 Months",
        saudiReady: false
    },
    {
        id: 5,
        type: "Private Equity",
        industry: "Finance & Investment",
        country: "Saudi Arabia",
        whatNeed: "Strategic Partners",
        whatOffer: "Capital, Advisory",
        dealSize: "10M",
        timeline: "Immediate",
        saudiReady: true
    }
];

// Strategic Fit Scoring
function calculateStrategicFit(userProfile, match) {
    let score = 0;
    const weights = {
        industryMatch: 0.25,
        needOfferMatch: 0.25,
        dealSizeProximity: 0.20,
        timelineAlignment: 0.15,
        saudiReady: 0.15
    };

    // Industry Match (0-25)
    if (userProfile.industry === match.industry) {
        score += 25 * weights.industryMatch;
    } else {
        score += 10 * weights.industryMatch;
    }

    // Need-Offer Match (0-25)
    const userNeedLower = userProfile.whatNeed.toLowerCase();
    const userOfferLower = userProfile.whatOffer.toLowerCase();
    const matchNeedLower = match.whatNeed.toLowerCase();
    const matchOfferLower = match.whatOffer.toLowerCase();

    let needOfferScore = 0;
    if (matchOfferLower.includes(userNeedLower) || userNeedLower.includes(matchOfferLower)) {
        needOfferScore = 25;
    } else if (hasCommonKeyword(userNeedLower, matchOfferLower)) {
        needOfferScore = 15;
    } else {
        needOfferScore = 5;
    }

    if (userOfferLower.includes(matchNeedLower) || matchNeedLower.includes(userOfferLower)) {
        needOfferScore += 25;
    } else if (hasCommonKeyword(userOfferLower, matchNeedLower)) {
        needOfferScore += 15;
    } else {
        needOfferScore += 5;
    }

    score += Math.min(needOfferScore / 2, 25) * weights.needOfferMatch;

    // Deal Size Proximity (0-20)
    const sizeDistance = calculateDealSizeDistance(userProfile.dealSize, match.dealSize);
    score += (20 - sizeDistance) * weights.dealSizeProximity;

    // Timeline Alignment (0-15)
    if (userProfile.timeline === match.timeline) {
        score += 15 * weights.timelineAlignment;
    } else if (isTimelineCompatible(userProfile.timeline, match.timeline)) {
        score += 10 * weights.timelineAlignment;
    } else {
        score += 3 * weights.timelineAlignment;
    }

    // Saudi Ready (0-15)
    if (match.saudiReady) {
        score += 15 * weights.saudiReady;
    }

    return Math.min(score, 100);
}

function hasCommonKeyword(text1, text2) {
    const keywords = ["capital", "technology", "market", "partner", "investment", "services", "advisory", "access", "opportunities"];
    return keywords.some(keyword => text1.includes(keyword) && text2.includes(keyword));
}

function calculateDealSizeDistance(size1, size2) {
    const sizeOrder = ["500K", "1M", "5M", "10M", "50M"];
    const index1 = sizeOrder.findIndex(s => size1.includes(s));
    const index2 = sizeOrder.findIndex(s => size2.includes(s));
    
    if (index1 === -1 || index2 === -1) return 10;
    return Math.abs(index1 - index2) * 2;
}

function isTimelineCompatible(timeline1, timeline2) {
    const timelineOrder = ["Immediate", "1–3 Months", "3–6 Months", "6–12 Months"];
    const index1 = timelineOrder.indexOf(timeline1);
    const index2 = timelineOrder.indexOf(timeline2);
    
    if (index1 === -1 || index2 === -1) return false;
    return Math.abs(index1 - index2) <= 1;
}

function getStrategicFitLevel(score) {
    if (score >= 75) return { level: "Very High", class: "fit-very-high" };
    if (score >= 60) return { level: "High", class: "fit-high" };
    return { level: "Medium", class: "fit-medium" };
}

// Find Matches Function
function findMatches(userProfile) {
    const matches = DATABASE.map(match => ({
        ...match,
        score: calculateStrategicFit(userProfile, match)
    }));

    // Sort by score descending and take top 5
    return matches.sort((a, b) => b.score - a.score).slice(0, 5);
}

// Anonymize Match Info
function anonymizeMatch(match) {
    return {
        ...match,
        type: match.type  // Keep entity type visible
    };
}

// Create Match Card HTML
function createMatchCard(match, index) {
    const fitInfo = getStrategicFitLevel(match.score);
    
    return `
        <div class="match-card" id="card-${index}">
            <div class="card-header">
                <h3>Match #${index + 1}</h3>
                <div class="strategic-fit ${fitInfo.class}">
                    Strategic Fit: ${fitInfo.level}
                </div>
            </div>
            <div class="card-body">
                <div class="card-info-row">
                    <div class="info-label">Entity Type</div>
                    <div class="info-value">${match.type}</div>
                </div>
                <div class="card-info-row">
                    <div class="info-label">Sector</div>
                    <div class="info-value">${match.industry}</div>
                </div>
                <div class="card-info-row">
                    <div class="info-label">Market</div>
                    <div class="info-value">${match.country}</div>
                </div>
                <div class="card-info-row">
                    <div class="info-label">What They're Seeking</div>
                    <div class="info-value">${match.whatNeed}</div>
                </div>
                <div class="card-info-row">
                    <div class="info-label">Deal Size</div>
                    <div class="info-value">$${match.dealSize}</div>
                </div>
                <div class="card-info-row">
                    <div class="info-label">Timeline</div>
                    <div class="info-value">${match.timeline}</div>
                </div>
            </div>
            <div class="card-footer">
                <button class="btn-interested" onclick="handleInterested(${index})">Interested</button>
                <button class="btn-skip" onclick="handleSkip(${index})">Skip</button>
            </div>
        </div>
    `;
}

// Event Listeners
document.getElementById('profileForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const userProfile = {
        industry: document.getElementById('industry').value,
        country: document.getElementById('country').value,
        whatNeed: document.getElementById('whatNeed').value,
        whatOffer: document.getElementById('whatOffer').value,
        targetMarket: document.getElementById('targetMarket').value,
        dealSize: document.getElementById('dealSize').value,
        timeline: document.getElementById('timeline').value
    };

    const matches = findMatches(userProfile);

    // Display Results
    displayMatches(matches);
});

function displayMatches(matches) {
    const formSection = document.getElementById('formSection');
    const resultsSection = document.getElementById('resultsSection');
    const matchesGrid = document.getElementById('matchesGrid');
    const noMatches = document.getElementById('noMatches');
    const matchCount = document.getElementById('matchCount');

    formSection.style.display = 'none';
    
    if (matches.length === 0) {
        resultsSection.classList.add('active');
        matchesGrid.innerHTML = '';
        noMatches.classList.remove('hide');
        matchCount.textContent = 'No suitable matches found in our network.';
    } else {
        resultsSection.classList.add('active');
        noMatches.classList.add('hide');
        matchesGrid.innerHTML = matches.map((match, index) => createMatchCard(match, index)).join('');
        matchCount.textContent = `Found ${matches.length} strategic partnership${matches.length !== 1 ? 's' : ''} for you`;
    }
}

function handleInterested(index) {
    const card = document.getElementById(`card-${index}`);
    card.classList.add('fade-out');
    setTimeout(() => {
        card.style.display = 'none';
        checkIfAllProcessed();
    }, 300);
    
    // In a real app, this would save the interest to a backend
    console.log(`User interested in match ${index + 1}`);
}

function handleSkip(index) {
    const card = document.getElementById(`card-${index}`);
    card.classList.add('fade-out');
    setTimeout(() => {
        card.style.display = 'none';
        checkIfAllProcessed();
    }, 300);
    
    // In a real app, this would log the skip action
    console.log(`User skipped match ${index + 1}`);
}

function checkIfAllProcessed() {
    const matchesGrid = document.getElementById('matchesGrid');
    const visibleCards = matchesGrid.querySelectorAll('.match-card:not([style*="display: none"])');
    
    if (visibleCards.length === 0) {
        const noMatches = document.getElementById('noMatches');
        noMatches.classList.remove('hide');
        noMatches.innerHTML = `
            <h3>You've reviewed all matches!</h3>
            <p>Great job exploring partnerships. Ready to find more?</p>
            <button class="btn-back" onclick="goBackToForm()">← Back to Profile</button>
        `;
    }
}

function goBackToForm() {
    document.getElementById('formSection').style.display = 'grid';
    document.getElementById('resultsSection').classList.remove('active');
    document.getElementById('profileForm').reset();
}