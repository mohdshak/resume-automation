# Product Plan: AI Job Description Analyzer & Auto-Resume Tailor (ResumeTailor AI)

## Executive Summary & Product Vision
Applying to modern jobs requires tailoring resumes to match specific Applicant Tracking Systems (ATS) algorithms and hiring manager criteria. Generic resumes often get filtered out due to missing keywords, non-standard phrasing, or suboptimal alignment.

**ResumeTailor AI** is an intelligent, automated end-to-end platform powered by a **collaborative multi-agent architecture** that analyzes job descriptions, audits candidate experience, tailors content using the XYZ/STAR frameworks, rigorously verifies factual integrity, and produces ATS-compliant resumes.

---

## First-Time User Experience (FTUE) & Onboarding Flow

When a user opens the application for the very first time (or has no saved Master Resume), the app launches a **guided 3-step onboarding flow**:

```mermaid
graph LR
    A[First-Time Arrival] --> B[1. Welcome & Upload Prompt]
    B -->|Drag & Drop PDF/DOCX or Paste| C[2. Candidate Archivist Parsing Engine]
    C --> D[3. Interactive Master Profile Verification]
    D -->|Confirm & Save Master Profile| E[Main Workspace: JD Tailoring Dashboard]
```

### Step 1: Welcome & Master Resume Upload Modal
* **Clean, high-impact welcome screen**: Explains the core value proposition (*"Upload your current resume once. We'll turn it into your master career knowledge base and tailor it perfectly for any job posting."*).
* **Multi-channel upload options**:
  * **Drag & Drop Zone**: Supports `.pdf`, `.docx`, `.txt`, `.json` (JSON Resume format).
  * **Direct Text / Markdown Paste**: For quick pasting of existing resume text.
  * **Sample Profile Option**: *"Try with a sample Tech / Product / Marketing resume"* for instant exploration without uploading personal data.

### Step 2: Automated Parsing & Knowledge Extraction
* **Candidate Archivist Agent** extracts structured data:
  * Contact info (Name, Email, Phone, LinkedIn, GitHub, Portfolio).
  * Professional Summary.
  * Work Experience (Company, Title, Dates, Location, Quantified Bullet Points).
  * Technical Skills, Tools, and Categorized Competencies.
  * Education, Certifications, and Side Projects.

### Step 3: Interactive Master Profile Verification & Enrichment
* **Instant Profile Preview Card**: Displays parsed data in clean editable cards.
* **Master Experience Bank**: The user can review, add extra sub-bullets, unquantified achievements, or hidden skills they didn't have space for in their 1-page resume.
* **One-Click Confirmation**: Sets this as the user's permanent **Master Ground Truth** and transitions directly into the Job Tailoring workspace.

---

## Multi-Agent Architecture: How AI Agents Power the Product

```mermaid
graph TD
    subgraph Ingestion & Intelligence
        A[Target JD] --> Agent1[1. JD Intelligence Agent<br><i>Extracts skills, tools & must-haves</i>]
        B[Master Profile] --> Agent2[2. Candidate Archivist Agent<br><i>Semantic search over past work</i>]
    end

    Agent1 & Agent2 --> Agent3[3. ATS Auditor & Gap Analyst<br><i>Computes match % & missing keywords</i>]

    subgraph Optimization & Validation Loop
        Agent3 -->|Strategy & Missing Keywords| Agent4[4. Resume Copywriter Agent<br><i>Rewrites bullets using STAR/XYZ formula</i>]
        Agent2 -->|Master Ground Truth| Agent5[5. Fact-Checking Guardrail Agent<br><i>Anti-hallucination compliance audit</i>]
        Agent4 -->|Draft Resume| Agent5
        Agent5 -->|Passes Fact Check| Agent6[6. ATS Scoring & Critic Agent<br><i>Evaluates ATS Score ≥ 85%</i>]
        
        Agent5 -.->|Hallucination Detected: Reject & Revise| Agent4
        Agent6 -.->|Score < 85% or Low Keyword Density: Revise| Agent4
    end

    Agent6 -->|Approved Final Draft| Agent7[7. Typesetter & Export Agent<br><i>Formats ATS-safe PDF / DOCX</i>]
    Agent7 --> Output[Export Ready Resume + Visual Diff View]
```

### Agent Roles & Responsibilities

| Agent Name | Role & Persona | Key Responsibilities & Capabilities |
| :--- | :--- | :--- |
| **1. JD Intelligence Agent** | *Senior Technical Recruiter* | • Parses and structures raw JDs (URLs, text, PDFs).<br>• Extracts hard technical skills, tools, domain keywords, and must-have vs. nice-to-have criteria.<br>• Identifies company tone, culture, and primary pain points the role seeks to solve. |
| **2. Candidate Archivist Agent** | *Career Historian & Knowledge Retriever* | • Parses incoming Master Resumes during onboarding.<br>• Manages the candidate's Master Knowledge Base (all past roles, projects, metrics, skills).<br>• Performs vector similarity search to retrieve the most relevant past achievements for the target role. |
| **3. ATS Auditor & Gap Analyst** | *ATS Algorithm Simulator* | • Computes lexical keyword match & semantic vector overlap.<br>• Identifies missing keywords, under-represented tools, and vocabulary mismatches.<br>• Generates an optimization strategy blueprint for the Copywriter Agent. |
| **4. Resume Copywriter Agent** | *Executive Resume Strategist* | • Rewrites and strengthens bullet points using the **XYZ framework** (*Accomplished [X], measured by [Y], by doing [Z]*).<br>• Adapts professional summary to speak directly to the company's needs.<br>• Reorders skills and experience sections to emphasize top-matching capabilities. |
| **5. Fact-Checking Guardrail Agent** | *Strict Compliance Auditor* | • **Anti-Hallucination Guard**: Compares tailored draft against Master Profile ground truth.<br>• Rejects any fabricated metrics, unverified company names, fake skills, or altered dates.<br>• Triggers a self-correction loop if any embellishments are detected. |
| **6. ATS Critic & Score Evaluator** | *Quality Assurance Benchmark* | • Evaluates the revised resume against target ATS criteria (target score $\ge 85\%$).<br>• If score or keyword density is insufficient, provides actionable feedback back to the Copywriter. |
| **7. Typesetter & Export Agent** | *Document Architect* | • Enforces single/two-page space budget and standard ATS section headings.<br>• Compiles clean, machine-parseable PDF (HTML/Chromium or Typst/LaTeX) and DOCX files. |

---

## Core Product Features & Modules

### 1. Ingestion & Profile Management (Master Resume Vault)
* **Multi-Format Ingestion**: Upload PDF, DOCX, TXT, or JSON (JSONResume standard) or import from LinkedIn.
* **Master Skill Matrix**: Centralized repository of all past experiences, projects, quantified achievements, certifications, and technical proficiencies.
* **Granular Experience Bank**: Allows storing multiple variations and sub-bullets for each role so the AI can pick the most relevant accomplishments.

### 2. Job Description Analyzer & Skill Extraction Engine
* **Entity Extraction**:
  * **Hard Skills & Tools**: Python, React, AWS, Docker, PyTorch, Kubernetes, etc.
  * **Methodologies & Domain**: CI/CD, Agile/Scrum, Distributed Systems, Microservices, HIPAA compliance.
  * **Soft Skills & Leadership**: Cross-functional leadership, Mentorship, Stakeholder management.
  * **Seniority & Role Level**: Years of experience required, scope of ownership.
* **Requirement Categorization**: Strict separation of *Must-Have* vs. *Nice-to-Have* qualifications.

### 3. Match Scoring & ATS Simulation Engine
* **Hybrid Match Algorithm**:
  * **Lexical & Keyword Match (40%)**: Direct match of critical domain terms, certifications, and tools.
  * **Semantic Relevance (35%)**: Vector embeddings (cosine similarity) matching role responsibilities with past work.
  * **Impact & Structure Score (15%)**: Readability, active verbs, quantification metrics (XYZ formula).
  * **ATS Format Compliance (10%)**: Standard section headers, chronological ordering, parse-safe layouts.
* **Interactive Gap Visualizer**: Highlight missing keywords, under-emphasized skills, and terminology discrepancies.

### 4. Truth-Preserving Auto-Tailoring Engine
* **Targeted Executive Summary**: Rewrites the summary to directly address the target company's mission and job role.
* **Bullet Point Optimization (XYZ Framework)**:
  * *Accomplished [X], as measured by [Y], by doing [Z]*.
  * Synonyms and keyword alignment (e.g., matching "REST APIs" vs "Web Services").
* **Smart Skill Prioritization**: Re-orders skills to highlight the target JD's required stack first.
* **Section Relevance Pruning**: Automatically promotes highly relevant projects/roles and condenses less relevant sections to maintain a clean 1–2 page layout.

### 5. Review, Diff Inspector & Export
* **Side-by-Side Diff Viewer**: Green/red diff highlighting every modified word or bullet point with an AI rationale explaining *why* it was adapted.
* **Interactive Editor**: Live inline editing with instant ATS score recalculation.
* **ATS-Safe Multi-Format Exporter**:
  * Clean, single-column ATS-tested PDF (LaTeX / headless Chromium render).
  * Editable DOCX format.
  * JSON Resume format.
* **Job Application Pipeline Tracker**: Keeps a log of each tailored resume mapped to Company, Job Title, Application URL, Date, and Status (Applied, Interviewing, Offered, Rejected).
