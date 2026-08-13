import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

const sampleProfiles: Record<string, any> = {
  tech: {
    basics: {
      name: "Alex Mercer",
      label: "Senior Full Stack & Distributed Systems Engineer",
      email: "alex.mercer@example.com",
      phone: "+1 (555) 234-5678",
      url: "https://alexmercer.dev",
      summary: "Full Stack Engineer with 6+ years of experience designing high-throughput microservices, cloud infrastructure, and responsive web applications. Specialized in Python, TypeScript, FastAPI, React, Kubernetes, and distributed event-driven systems handling 50M+ daily requests.",
      location: { city: "San Francisco", region: "California", countryCode: "US" },
      profiles: [{ network: "LinkedIn", username: "alexmercer-dev", url: "https://linkedin.com/in/alexmercer-dev" }]
    },
    work: [
      {
        name: "CloudScale Technologies",
        position: "Senior Software Engineer",
        startDate: "2022-03-01",
        endDate: "Present",
        summary: "Lead engineer on the real-time stream processing platform and multi-tenant data ingest API.",
        highlights: [
          "Architected asynchronous ingestion pipeline using FastAPI, Apache Kafka, and PostgreSQL, scaling throughput from 10K to 85K events/sec with sub-50ms latency.",
          "Reduced cloud infrastructure costs by 32% ($140K/yr) by optimizing Kubernetes pod autoscaling and container memory footprint.",
          "Mentored team of 6 engineers and spearheaded automated CI/CD migration to GitHub Actions, cutting release deployment cycle times by 45%."
        ]
      }
    ],
    education: [{ institution: "University of California, Berkeley", area: "Computer Science", studyType: "Bachelor of Science", startDate: "2015-08-01", endDate: "2019-05-15", score: "3.85 GPA" }],
    skills: [
      { name: "Programming Languages", keywords: ["Python", "TypeScript", "JavaScript", "Go", "SQL"] },
      { name: "Backend & Distributed Systems", keywords: ["FastAPI", "Django", "Node.js", "Apache Kafka", "Redis", "gRPC", "RESTful APIs", "Microservices"] },
      { name: "Cloud & DevOps", keywords: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD"] }
    ],
    projects: [],
    certifications: [{ name: "AWS Certified Solutions Architect – Associate", issuer: "Amazon Web Services", date: "2023-04-10" }]
  },
  product: {
    basics: {
      name: "Sarah Jenkins",
      label: "Senior Product Manager",
      email: "sarah.jenkins@example.com",
      phone: "+1 (555) 987-6543",
      url: "https://sarahjenkins.io",
      summary: "Product Management leader with 7+ years of experience launching B2B SaaS, ecommerce automation, and AI-driven workflow products. Track record of scaling ARR from $2M to $18M, driving PLG conversion funnels, and leading cross-functional squads across product, engineering, and data science.",
      location: { city: "New York", region: "New York", countryCode: "US" },
      profiles: [{ network: "LinkedIn", username: "sarah-jenkins-pm", url: "https://linkedin.com/in/sarah-jenkins-pm" }]
    },
    work: [
      {
        name: "Vortex AI Platform",
        position: "Senior Product Manager",
        startDate: "2021-08-01",
        endDate: "Present",
        summary: "Owner of core analytics intelligence suite and automated reporting product lines.",
        highlights: [
          "Spearheaded launch of AI Insights copilot, generating $4.2M in new ARR within 9 months of release.",
          "Increased free-to-paid trial conversion by 34% through friction-reduced onboarding experiments and cohort analytics.",
          "Managed roadmap for 3 agile engineering squads (24 engineers/designers) utilizing Linear and Amplitude."
        ]
      },
      {
        name: "Beacon Growth SaaS",
        position: "Product Manager",
        startDate: "2018-04-01",
        endDate: "2021-07-31",
        summary: "Led self-serve acquisition funnels and integrations ecosystem.",
        highlights: [
          "Launched 20+ third-party integrations (Shopify, QuickBooks, Salesforce), increasing multi-product retention by 22%.",
          "Conducted 120+ user discovery interviews to define MVP specs for enterprise compliance features."
        ]
      }
    ],
    education: [{ institution: "Northwestern University", area: "Industrial Engineering & Economics", studyType: "Bachelor of Science", startDate: "2013-09-01", endDate: "2017-06-15", score: "3.90 GPA" }],
    skills: [
      { name: "Product Strategy & Leadership", keywords: ["Product Roadmap", "Product-Led Growth (PLG)", "Customer Discovery", "Agentic Workflows", "B2B SaaS"] },
      { name: "Analytics & Metrics", keywords: ["SQL", "Amplitude", "Mixpanel", "A/B Testing", "Cohort Retention", "Funnel Optimization"] },
      { name: "Ecommerce & Integrations", keywords: ["Shopify", "Amazon", "Walmart", "QuickBooks", "NetSuite", "Reconciliation"] }
    ],
    projects: [],
    certifications: [{ name: "Reforge Product Leadership", issuer: "Reforge", date: "2022-06-01" }]
  },
  data: {
    basics: {
      name: "Dr. Maya Patel",
      label: "Staff Machine Learning Engineer & Data Scientist",
      email: "maya.patel@example.com",
      phone: "+1 (555) 345-6789",
      summary: "Data Scientist & ML Engineer with 6+ years specializing in Large Language Model (LLM) fine-tuning, RAG pipelines, recommender systems, and productionizing deep learning models on GPU clusters."
    },
    work: [
      {
        name: "OmniAI Labs",
        position: "Staff Machine Learning Engineer",
        startDate: "2022-01-01",
        endDate: "Present",
        highlights: [
          "Designed and deployed enterprise RAG pipeline indexing 40M+ multimodal documents with Milvus and LangChain, improving answer recall from 64% to 92%.",
          "Fine-tuned open-weights LLMs using LoRA and QLoRA on 8x H100 GPU clusters, cutting API inference costs by 68% ($320K/yr)."
        ]
      }
    ],
    education: [{ institution: "University of Washington", area: "Computer Science & AI", studyType: "Ph.D." }],
    skills: [
      { name: "Machine Learning & AI", keywords: ["PyTorch", "Transformers", "LLM Fine-tuning", "RAG Systems", "LangChain", "Vector Databases"] }
    ]
  }
};

export async function GET(
  req: NextRequest,
  { params }: { params: { sampleType: string } }
) {
  const type = params.sampleType || "tech";
  const profile = sampleProfiles[type] || sampleProfiles.tech;
  return NextResponse.json({
    status: "success",
    sample_type: type,
    parsed_profile: profile
  });
}
