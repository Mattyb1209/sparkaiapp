// Spark AI — Real Estate Assessment Engine
// ==========================================

let currentStep = 0;
const totalSteps = 12;
const responses = {};

const wizard = document.getElementById('wizard');
const progressBar = document.getElementById('progressBar');
const backBtn = document.getElementById('backBtn');

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
    setupOptionButtons();
    updateProgress();
    updateBackButton();
});

function setupOptionButtons() {
    document.querySelectorAll('.options').forEach(optionGroup => {
        const isMulti = optionGroup.classList.contains('multi');
        const field = optionGroup.dataset.field;

        optionGroup.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (isMulti) {
                    btn.classList.toggle('selected');
                    responses[field] = Array.from(optionGroup.querySelectorAll('.option-btn.selected'))
                        .map(b => b.dataset.value);
                } else {
                    optionGroup.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    responses[field] = btn.dataset.value;
                    setTimeout(() => nextStep(), 300);
                }
            });
        });
    });
}

// ── Navigation ──
function nextStep() {
    if (currentStep < totalSteps - 1) {
        document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('active');
        document.querySelector(`.step[data-step="${currentStep + 1}"]`).classList.add('active');
        currentStep++;
        updateProgress();
        updateBackButton();
        window.scrollTo(0, 0);
    }
}

function prevStep() {
    if (currentStep > 0) {
        document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('active');
        document.querySelector(`.step[data-step="${currentStep - 1}"]`).classList.add('active');
        currentStep--;
        updateProgress();
        updateBackButton();
        window.scrollTo(0, 0);
    }
}

function updateProgress() {
    progressBar.style.width = `${(currentStep / (totalSteps - 1)) * 100}%`;
}

function updateBackButton() {
    backBtn.classList.toggle('visible', currentStep > 0 && currentStep < totalSteps - 1);
}

// ── Report Generation ──
function generateReport() {
    const name = document.getElementById('userName').value || 'there';
    const email = document.getElementById('userEmail').value;
    const phone = document.getElementById('userPhone').value;

    if (!email || !email.includes('@')) {
        alert('Please enter a valid email address');
        return;
    }

    responses.name = name;
    responses.email = email;
    responses.phone = phone;

    const report = analyzeResponses(responses);
    displayResults(report);
    nextStep();
}

// ── Analysis Engine ──
function analyzeResponses(data) {
    const opportunities = [];
    const quickWins = [];
    let sparkScore = 40;
    let totalMinHours = 0;
    let totalMaxHours = 0;
    let moneyLeft = 0; // estimated $ left on the table per year

    const timeDrains = data.timeDrains || [];
    const leadSources = data.leadSources || [];
    const responseTime = data.responseTime;
    const volume = data.volume;
    const databaseSize = data.databaseSize;
    const crm = data.crm;
    const role = data.role;

    // ── Lead Follow-Up (THE BIG ONE) ──
    if (timeDrains.includes('lead-followup') || responseTime !== 'instant') {
        const isSlowResponder = ['hours', 'nextday', 'depends'].includes(responseTime);
        const severity = isSlowResponder ? 'critical' : 'high';

        opportunities.push({
            title: '🚨 Lead Response Autopilot',
            description: isSlowResponder
                ? `You're responding in hours — but 78% of buyers go with the first agent who picks up. At your volume, slow follow-up could be costing you 3-5 deals per year.`
                : `Even at your speed, an AI assistant can respond in under 60 seconds — 24/7, including nights and weekends when you're off.`,
            timeSaved: '5–10 hrs/week',
            priority: severity,
            dollarImpact: isSlowResponder ? '$30K–$75K/year in lost commission' : '$15K–$30K/year in recovered leads'
        });
        quickWins.push({
            icon: '⚡',
            title: 'Speed-to-lead is everything',
            description: 'AI can text new leads within 60 seconds, qualify them, and book a call — even at 2am'
        });
        sparkScore += isSlowResponder ? 18 : 10;
        totalMinHours += 5; totalMaxHours += 10;
        moneyLeft += isSlowResponder ? 50000 : 20000;
    }

    // ── Database Mining ──
    if (['500-1000', '1000-5000', '5000+'].includes(databaseSize)) {
        opportunities.push({
            title: '💰 Database Goldmine',
            description: `You have ${databaseSize === '5000+' ? '5,000+' : databaseSize} contacts sitting in your database. Past clients, old leads, your sphere — most agents never re-engage them. AI can identify who's likely to move and send personalized outreach automatically.`,
            timeSaved: '3–6 hrs/week',
            priority: 'high',
            dollarImpact: '2–5 extra transactions/year'
        });
        quickWins.push({
            icon: '📇',
            title: 'Reactivate your database',
            description: 'AI identifies contacts by last-touch date and ownership length, then drafts personalized check-ins'
        });
        sparkScore += 14;
        totalMinHours += 3; totalMaxHours += 6;
        moneyLeft += 40000;
    } else if (['100-500'].includes(databaseSize)) {
        opportunities.push({
            title: '📇 Sphere Nurturing',
            description: `Your ${databaseSize} contacts are your most valuable asset. AI can send personalized market updates, anniversary check-ins, and "just thinking of you" messages that keep you top-of-mind — without you lifting a finger.`,
            timeSaved: '2–3 hrs/week',
            priority: 'medium',
            dollarImpact: '1–3 extra referrals/year'
        });
        sparkScore += 8;
        totalMinHours += 2; totalMaxHours += 3;
        moneyLeft += 20000;
    }

    // ── Content & Listings ──
    if (timeDrains.includes('content') || timeDrains.includes('marketing')) {
        opportunities.push({
            title: '✍️ Content Machine',
            description: 'AI generates listing descriptions, social media posts, email newsletters, and market updates — all in your voice. What takes you 45 minutes takes AI 30 seconds.',
            timeSaved: '5–8 hrs/week',
            priority: 'high',
            dollarImpact: 'Replaces $1,500–$3,000/mo marketing assistant'
        });
        quickWins.push({
            icon: '📝',
            title: 'Instant listing descriptions',
            description: 'Feed AI the MLS data and get a polished, compelling listing description in seconds'
        });
        sparkScore += 12;
        totalMinHours += 5; totalMaxHours += 8;
    }

    // ── Transaction Coordination ──
    if (timeDrains.includes('transaction') || timeDrains.includes('admin')) {
        const dealVolume = volume || '6-15';
        opportunities.push({
            title: '📑 Transaction Autopilot',
            description: `Each transaction has 40+ tasks and 30 hours of admin. AI tracks every deadline, sends reminders to all parties, drafts communications, and flags anything falling behind. ${dealVolume === '50+' ? 'At your volume, this is a game-changer.' : 'This alone could save you a full day per deal.'}`,
            timeSaved: '8–15 hrs/week',
            priority: 'high',
            dollarImpact: 'Save $300–$500 per transaction vs hiring a TC'
        });
        sparkScore += 15;
        totalMinHours += 8; totalMaxHours += 15;
    }

    // ── Scheduling ──
    if (timeDrains.includes('scheduling')) {
        opportunities.push({
            title: '📅 Smart Scheduling',
            description: 'AI coordinates showings between buyers, sellers, and agents — no more phone tag. Handles confirmations, reminders, and rescheduling automatically.',
            timeSaved: '3–5 hrs/week',
            priority: 'medium',
            dollarImpact: 'More showings = more offers'
        });
        sparkScore += 8;
        totalMinHours += 3; totalMaxHours += 5;
    }

    // ── CRM Hygiene ──
    if (timeDrains.includes('crm-updates') || crm === 'spreadsheet' || crm === 'none') {
        const noCrm = crm === 'spreadsheet' || crm === 'none';
        opportunities.push({
            title: noCrm ? '🔧 CRM Setup & Automation' : '🔄 CRM Autopilot',
            description: noCrm
                ? `Running a real estate business without a proper CRM is like driving without a GPS. AI can set one up, import your contacts, and keep it updated automatically — so you never have to do data entry again.`
                : `AI can auto-update your CRM after every interaction — calls, texts, emails, showings. No more manual logging. Your CRM stays current without you touching it.`,
            timeSaved: '3–5 hrs/week',
            priority: noCrm ? 'critical' : 'medium',
            dollarImpact: noCrm ? 'Stop losing leads to disorganization' : 'Clean data = better follow-up = more closings'
        });
        sparkScore += noCrm ? 15 : 8;
        totalMinHours += 3; totalMaxHours += 5;
    }

    // ── Prospecting ──
    if (timeDrains.includes('prospecting')) {
        opportunities.push({
            title: '🔍 AI Prospecting',
            description: 'AI identifies likely sellers in your farm area by analyzing property ownership length, equity positions, and life events. Then drafts personalized outreach so you\'re first in the door.',
            timeSaved: '4–6 hrs/week',
            priority: 'medium',
            dollarImpact: 'More listings without cold calling'
        });
        sparkScore += 10;
        totalMinHours += 4; totalMaxHours += 6;
    }

    // ── Client Communication ──
    if (timeDrains.includes('client-comms')) {
        opportunities.push({
            title: '💬 Client Updates on Autopilot',
            description: 'AI sends weekly transaction updates to your buyers and sellers automatically. They feel informed and taken care of — and you didn\'t have to write a single email.',
            timeSaved: '3–5 hrs/week',
            priority: 'medium',
            dollarImpact: 'Better reviews, more referrals'
        });
        sparkScore += 8;
        totalMinHours += 3; totalMaxHours += 5;
    }

    // ── Open House Follow-Up ──
    if (leadSources.includes('openhouse')) {
        opportunities.push({
            title: '🏡 Open House Follow-Up',
            description: 'Every sign-in sheet visitor gets a personalized follow-up within hours — referencing the property, asking about their search, offering to set up alerts. No more "I forgot to follow up."',
            timeSaved: '2–3 hrs/week',
            priority: 'medium',
            dollarImpact: 'Convert 20-30% more open house visitors'
        });
        sparkScore += 7;
        totalMinHours += 2; totalMaxHours += 3;
    }

    // ── Zillow/Portal Lead Waste ──
    if (leadSources.includes('zillow')) {
        if (!opportunities.find(o => o.title.includes('Lead Response'))) {
            opportunities.push({
                title: '🟡 Stop Wasting Zillow Leads',
                description: 'You\'re paying $20-50 per Zillow lead. Without instant follow-up, 60-80% go cold. AI responds instantly, qualifies, and books — so every dollar you spend on leads actually works.',
                timeSaved: '3–5 hrs/week',
                priority: 'high',
                dollarImpact: 'Recover $500–$2,000/mo in wasted ad spend'
            });
            sparkScore += 10;
            totalMinHours += 3; totalMaxHours += 5;
        }
    }

    // ── Score adjustments ──
    if (data.aiExperience === 'none') sparkScore += 8;
    if (data.aiExperience === 'chatgpt') sparkScore += 4;

    // Volume multiplier
    if (['31-50', '50+'].includes(volume)) sparkScore += 5;

    sparkScore = Math.min(sparkScore, 97);

    // Sort by priority
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    opportunities.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return {
        name: data.name,
        role: data.role,
        volume: data.volume,
        sparkScore,
        opportunities: opportunities.slice(0, 5),
        quickWins: quickWins.slice(0, 3),
        totalTimeSaved: `${totalMinHours}–${totalMaxHours}`,
        moneyLeft,
        responseTime: data.responseTime,
        databaseSize: data.databaseSize
    };
}

// ── Display Results ──
function displayResults(report) {
    const container = document.getElementById('resultsContainer');

    const scoreColor = report.sparkScore >= 75 ? '#ef4444' : report.sparkScore >= 50 ? '#f59e0b' : '#22c55e';
    const scoreMessage = report.sparkScore >= 75
        ? "You're leaving serious money on the table."
        : report.sparkScore >= 50
        ? "You've got real opportunities to save time and close more."
        : "You're in good shape — but there's another level.";

    // First opportunity is visible, rest are blurred/locked
    const firstOpp = report.opportunities[0];
    const lockedOpps = report.opportunities.slice(1);

    container.innerHTML = `
        <div class="results-header">
            <h1>${report.name}'s AI Score</h1>
            <p class="subtitle">${scoreMessage}</p>
        </div>

        <div class="spark-score">
            <div class="score-circle" style="border-color: ${scoreColor}">
                <div class="score-number" style="color: ${scoreColor}">${report.sparkScore}</div>
                <div class="score-label">AI Opportunity Score</div>
            </div>
        </div>

        <div class="stats-row">
            <div class="stat-card">
                <div class="stat-number">${report.totalTimeSaved}</div>
                <div class="stat-label">hours/week you could save</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${report.opportunities.length}</div>
                <div class="stat-label">automations found</div>
            </div>
        </div>

        <!-- First opportunity: VISIBLE -->
        <div class="results-section">
            <h3>🎯 #1 Priority for Your Business</h3>
            <div class="opportunity-item ${firstOpp.priority}">
                <div class="opp-header">
                    <h4>${firstOpp.title}</h4>
                    ${firstOpp.priority === 'critical' ? '<span class="priority-badge critical">URGENT</span>' : ''}
                    ${firstOpp.priority === 'high' ? '<span class="priority-badge high">HIGH IMPACT</span>' : ''}
                </div>
                <p>${firstOpp.description}</p>
                <div class="opp-meta">
                    <span class="time-saved">⏱️ Save ${firstOpp.timeSaved}</span>
                    ${firstOpp.dollarImpact ? `<span class="dollar-impact">💰 ${firstOpp.dollarImpact}</span>` : ''}
                </div>
            </div>
        </div>

        <!-- Remaining opportunities: LOCKED/BLURRED -->
        <div class="results-section locked-section">
            <h3>🔒 ${lockedOpps.length} More Opportunities Found</h3>
            <div class="locked-preview">
                ${lockedOpps.map(opp => `
                    <div class="opportunity-item locked">
                        <div class="opp-header">
                            <h4>${opp.title}</h4>
                            ${opp.priority === 'critical' ? '<span class="priority-badge critical">URGENT</span>' : ''}
                            ${opp.priority === 'high' ? '<span class="priority-badge high">HIGH IMPACT</span>' : ''}
                        </div>
                        <p class="locked-text">████████ ████ ██████████ ████████ ██████ ████ ██████ ████████ ██████████ ███████ ████ ██████</p>
                        <div class="opp-meta">
                            <span class="time-saved">⏱️ Save █–██ hrs/week</span>
                            <span class="dollar-impact">💰 ████████████</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        ${report.quickWins.length > 0 ? `
        <div class="results-section">
            <h3>⚡ One Quick Win to Try Today</h3>
            <div class="quick-win">
                <div class="quick-win-icon">${report.quickWins[0].icon}</div>
                <div class="quick-win-text">
                    <h4>${report.quickWins[0].title}</h4>
                    <p>${report.quickWins[0].description}</p>
                </div>
            </div>
            ${report.quickWins.length > 1 ? `
                <div class="quick-win locked">
                    <div class="quick-win-icon">🔒</div>
                    <div class="quick-win-text">
                        <h4>${report.quickWins.length - 1} more quick wins</h4>
                        <p>Unlock your full report in a free strategy call</p>
                    </div>
                </div>
            ` : ''}
        </div>
        ` : ''}

        <div class="cta-section">
            <h3>You don't need to learn AI.<br>You need someone to set it up for you.</h3>
            <p>We'll walk through your full report, show you exactly what to automate first, and build you a plan — whether you're doing 5 deals or 50.</p>
            <ul class="cta-bullets">
                <li>✅ Your complete ${report.opportunities.length}-point AI game plan</li>
                <li>✅ Which leads you're losing and how to catch them</li>
                <li>✅ What to automate first for the biggest impact</li>
                <li>✅ Options that work for any budget — even $0 upfront</li>
            </ul>
            <a href="#" class="btn-cta" id="calendlyBtn" onclick="bookCall()">Book a Free 15-Min Call</a>
            <p class="cta-subtext">No pitch. No pressure. If we can help, we'll tell you how. If not, you still keep the insights.</p>
        </div>

        <div class="footer-note">
            <p>✦ Spark AI — AI that works while you close deals</p>
        </div>
    `;

    // Submit data to Netlify Forms (hidden form)
    submitToNetlify(responses, report);
}

// ── Submit to Netlify Forms ──
function submitToNetlify(data, report) {
    const formData = new FormData();
    formData.append('form-name', 'spark-assessment');
    formData.append('name', data.name || '');
    formData.append('email', data.email || '');
    formData.append('phone', data.phone || '');
    formData.append('role', data.role || '');
    formData.append('volume', data.volume || '');
    formData.append('leadSources', (data.leadSources || []).join(', '));
    formData.append('crm', data.crm || '');
    formData.append('timeDrains', (data.timeDrains || []).join(', '));
    formData.append('responseTime', data.responseTime || '');
    formData.append('databaseSize', data.databaseSize || '');
    formData.append('dream', data.dream || '');
    formData.append('aiExperience', data.aiExperience || '');
    formData.append('sparkScore', report.sparkScore);
    formData.append('topOpportunity', report.opportunities[0]?.title || '');
    formData.append('totalTimeSaved', report.totalTimeSaved);

    fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
    }).catch(err => console.log('Form submission error:', err));
}

function bookCall() {
    window.open('https://calendly.com/matt-sparkaiapp', '_blank');
}
