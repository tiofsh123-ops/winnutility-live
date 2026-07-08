// Master Element Selectors
const step1Container = document.getElementById('formStep1');
const step2Container = document.getElementById('formStep2');
const step2Dot = document.getElementById('step2Indicator');
const dynamicBadge = document.getElementById('dynamicNotification');
const questionsArea = document.getElementById('dynamicQuestionsArea');

// Event Listener: Intercept the "Next Step" Request
document.getElementById('btnNextStep').addEventListener('click', function() {
    // 1. Run browser validation on Step 1 fields
    const inputs = step1Container.querySelectorAll('input[required]');
    let isValid = true;
    inputs.forEach(input => { if(!input.checkValidity()) { input.reportValidity(); isValid = false; } });

    if (!isValid) return; // Exit if Step 1 isn't fully filled out

    // 2. Read what they typed about their business
    const userCompany = document.getElementById('companyName').value;
    const businessText = document.getElementById('industryHint').value.toLowerCase();

    // 3. The Intelligent Keyword Router Rules
    let verticalType = "GENERAL";
    
    const constructionKeywords = ['roof', 'contracting', 'hvac', 'plumb', 'electric', 'build', 'construct', 'solar', 'paint'];
    const corporateKeywords = ['consult', 'cpa', 'agency', 'marketing', 'software', 'saas', 'law', 'legal', 'finance', 'recruit'];

    if (constructionKeywords.some(keyword => businessText.includes(keyword))) {
        verticalType = "CONSTRUCTION_TRADES";
    } else if (corporateKeywords.some(keyword => businessText.includes(keyword))) {
        verticalType = "PROFESSIONAL_SERVICES";
    }

    // 4. Generate & Inject the Tailored Questions
    generateSmartQuestions(verticalType, userCompany);

    // 5. Fire off the UI Transition Animation
    step1Container.classList.add('hidden');
    step2Container.classList.remove('hidden');
    step2Dot.classList.add('active');
});

// Event Listener: Handle "Back" Button
document.getElementById('btnPrevStep').addEventListener('click', function() {
    step2Container.classList.add('hidden');
    step1Container.classList.remove('hidden');
    step2Dot.classList.remove('active');
});

// Function: Build and render custom targeting questions on the fly
function generateSmartQuestions(vertical, companyName) {
    questionsArea.innerHTML = ""; // Wipe any previous run data clean

    if (vertical === "CONSTRUCTION_TRADES") {
        dynamicBadge.innerText = `🛠️ System optimized for Commercial & Specialty Trades. Configuring lookup metrics...`;
        
        questionsArea.innerHTML = `
            <div class="form-group">
                <label>A. Who signs off on your ideal projects?</label>
                <div class="radio-group">
                    <label class="checkbox-label"><input type="checkbox" name="smartTarget" value="Property/Facility Managers"> Commercial Property & Facility Managers</label>
                    <label class="checkbox-label"><input type="checkbox" name="smartTarget" value="HOA Board Presidents"> HOA Board Presidents & Developers</label>
                    <label class="checkbox-label"><input type="checkbox" name="smartTarget" value="General Contractors"> General Contractors (For subcontracting targets)</label>
                </div>
            </div>
            <div class="form-group">
                <label>B. Select high-value intent triggers to prioritize:</label>
                <div class="radio-group">
                    <label class="checkbox-label"><input type="checkbox" name="smartTrigger" value="Aging Property Asset"> Properties with structures > 15 years old</label>
                    <label class="checkbox-label"><input type="checkbox" name="smartTrigger" value="Recent Commercial Sale"> Assets purchased within the last 90 days</label>
                </div>
            </div>
        `;
    } 
    else if (vertical === "PROFESSIONAL_SERVICES") {
        dynamicBadge.innerText = `💼 System optimized for Corporate B2B & Agencies. Configuring technographic maps...`;
        
        questionsArea.innerHTML = `
            <div class="form-group">
                <label>A. Which leadership seat handles your budget?</label>
                <div class="radio-group">
                    <label class="checkbox-label"><input type="checkbox" name="smartTarget" value="Founders/CEOs"> Startup Founders, CEOs, & Managing Partners</label>
                    <label class="checkbox-label"><input type="checkbox" name="smartTarget" value="CMOs/VPs Marketing"> Chief Marketing Officers & Growth Directors</label>
                    <label class="checkbox-label"><input type="checkbox" name="smartTarget" value="VPs Sales/Ops"> Vice Presidents of Sales or Operations</label>
                </div>
            </div>
            <div class="form-group">
                <label>B. Select operational intent signals to monitor:</label>
                <div class="radio-group">
                    <label class="checkbox-label"><input type="checkbox" name="smartTrigger" value="Active Sales Hiring"> Companies actively expanding their sales department</label>
                    <label class="checkbox-label"><input type="checkbox" name="smartTrigger" value="Recent Venture Funding"> Companies that recently raised capital / seed funding</label>
                </div>
            </div>
        `;
    } 
    else {
        // GENERAL FALLBACK TEMPLATE
        dynamicBadge.innerText = `✨ System initialized general target framework. Mapping outreach profiles...`;
        
        questionsArea.innerHTML = `
            <div class="form-group">
                <label>A. Select the preferred target account scale:</label>
                <div class="radio-group">
                    <label class="checkbox-label"><input type="checkbox" name="smartTarget" value="Small Local"> Small Business / Local Owner (1-20 staff)</label>
                    <label class="checkbox-label"><input type="checkbox" name="smartTarget" value="Mid-Market"> Regional Mid-Market (21-200 staff)</label>
                    <label class="checkbox-label"><input type="checkbox" name="smartTarget" value="Enterprise"> Mid-Enterprise Corporation (201+ staff)</label>
                </div>
            </div>
            <div class="form-group">
                <label>B. What is the typical sales cycle length for your service?</label>
                <div class="radio-group">
                    <label class="checkbox-label"><input type="checkbox" name="smartTrigger" value="Fast transactional"> < 30 days (High velocity)</label>
                    <label class="checkbox-label"><input type="checkbox" name="smartTrigger" value="Strategic Enterprise"> 3 to 6+ months (High contract value)</label>
                </div>
            </div>
        `;
    }
}

// Event Listener: Core Submission Aggregator
document.getElementById('engineForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Map checked configurations
    const capturedTargets = Array.from(document.querySelectorAll('input[name="smartTarget"]:checked')).map(el => el.value);
    const capturedTriggers = Array.from(document.querySelectorAll('input[name="smartTrigger"]:checked')).map(el => el.value);

    // Build the master data payload
    const dynamicMasterData = {
        company: document.getElementById('companyName').value,
        rawDescription: document.getElementById('industryHint').value,
        targetGeography: document.getElementById('geoTarget').value,
        routingEmail: document.getElementById('routingEmail').value,
        
        // Dynamically parsed variables
        selectedDecisionMakers: capturedTargets,
        monitoredIntentSignals: capturedTriggers,
        
        systemLogs: {
            compiledAt: new Date().toISOString(),
            engineStatus: "SUCCESS_READY_FOR_PAYWALL"
        }
    };

    document.getElementById('formFeedback').style.display = 'block';
    console.log("🔥 MASTER DATA COMPiled! This is the asset we route past the paywall:", dynamicMasterData);
});

// =========================================================================
// RE-INDEXED LIFECYCLE CHRONOLOGY BLUEPRINT CONTROLLER
// =========================================================================

const phaseData = {
    phase1: {
        title: "Infrastructure Provisioning (Days 1–5)",
        desc: "We construct completely independent outreach architecture. By securing specialized lookalike domains and routing traffic via isolated IP footprints, we ensure your parent corporate domain remains entirely safe and untouched.",
        specs: [
            "Purchase and deploy custom secondary lookalike domain variations.",
            "Hardcode technical authentication protocols: SPF, DKIM, and DMARC handshakes.",
            "Configure centralized MX records to securely forward prospect replies back to you."
        ]
    },
    phase2: {
        title: "The Warmup Grid Phase (Days 6–19)",
        desc: "Crucial for delivery survival. New domains cannot blast out messages instantly without triggering security filters. We plug your nodes into an automated network to establish pristine sender reputation profiles completely behind the scenes.",
        specs: [
            "Place fresh nodes into a peer-to-peer programmatic conversational network.",
            "Execute synthetic high-reputation interactions to simulate normal traffic behavior.",
            "Monitor IP and domain blacklists hourly to guarantee 100% inbox readiness."
        ]
    },
    phase3: {
        title: "Intake & Signal Mapping (Day 20)",
        desc: "Your configurator data locks in your ideal territory framework. We extract your value metrics and map them out against real-world target triggers, feeding raw buyer profiles directly into our primary data sourcing node.",
        specs: [
            "Deconstruct target client profiles into programmatic behavioral signals.",
            "Establish suppression filters to isolate and protect active client data.",
            "Initialize multi-channel sourcing streams to locate active decision-makers."
        ]
    },
    phase4: {
        title: "Linguistic Copy Sign-Off & Go-Live (Day 21)",
        desc: "The final programmatic verification. Our engine structures customized text sequences optimized to dodge spam filters. You receive a fast dashboard link to select prescribed tone options, verify accuracy, and give the official launch signal.",
        specs: [
            "Review brand safety parameters using pre-optimized linguistic variants.",
            "Adjust baseline tonal levels or add specific industry vocabulary constraints.",
            "Authorize live pipeline production streams with a single-click green light."
        ]
    }
};

const cards = document.querySelectorAll('.flow-card');
const drawerPanel = document.getElementById('drawerPanel');
const drawerTitle = document.getElementById('drawerTitle');
const drawerDesc = document.getElementById('drawerDesc');
const drawerSpecs = document.getElementById('drawerSpecs');

cards.forEach(card => {
    card.addEventListener('click', () => {
        cards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        const targetPhase = card.getAttribute('data-phase');
        const data = phaseData[targetPhase];

        drawerPanel.style.opacity = 0.4;
        setTimeout(() => {
            drawerTitle.textContent = data.title;
            drawerDesc.textContent = data.desc;
            
            drawerSpecs.innerHTML = '';
            data.specs.forEach(spec => {
                const li = document.createElement('li');
                li.textContent = spec;
                drawerSpecs.appendChild(li);
            });
            drawerPanel.style.opacity = 1;
        }, 100);
    });
});