"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Rocket,
  Target,
  Users,
  Brain,
  Laptop,
  GraduationCap,
  Building2,
  Sparkles,
  Shield,
  Zap,
  Coffee,
  Heart,
  Code2,
  Facebook,
  Linkedin,
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="container py-8 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
          ICPC Training Management System
        </h1>
        <p className="text-xl text-muted-foreground max-w-[800px] mx-auto">
          A Unified Platform for Programming Education
        </p>
      </section>

      {/* About Us Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">About Us</h2>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Welcome to ICPC Assiut University Community - where coding excellence meets innovation! 🚀
            As a student-led initiative at Assiut University, we&apos;re dedicated to nurturing the next generation
            of competitive programmers. Our mission is simple: transform passionate students into problem-solving
            champions through comprehensive training and mentorship in competitive programming.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">
          Platform Features
          <Badge className="ml-2 bg-green-500/10 text-green-500">New</Badge>
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<Zap className="h-6 w-6" />}
            title="All-in-One Platform"
            description="Everything you need in one place - from training materials to progress tracking. No more juggling between different platforms!"
          />
          <FeatureCard
            icon={<Shield className="h-6 w-6" />}
            title="Secure & Reliable"
            description="Enterprise-grade security for your data and progress. Focus on learning while we handle the rest."
          />
          <FeatureCard
            icon={<Sparkles className="h-6 w-6" />}
            title="Smart Learning"
            description="AI-powered progress tracking and personalized recommendations to optimize your learning journey."
          />
          <FeatureCard
            icon={<Coffee className="h-6 w-6" />}
            title="Efficient Management"
            description="Streamlined tools for mentors to manage trainings and track student progress effectively."
          />
          <FeatureCard
            icon={<Heart className="h-6 w-6" />}
            title="Community-Driven"
            description="Join a vibrant community of learners and mentors. Learn, grow, and succeed together!"
          />
          <FeatureCard
            icon={<Code2 className="h-6 w-6" />}
            title="Built to Scale"
            description="Designed to handle hundreds of trainees while maintaining smooth performance and reliability."
          />
        </div>
      </section>

      {/* Training Programs */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Training Programs</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <ProgramCard
            icon={<Laptop className="h-6 w-6" />}
            title="Newcomers"
            description="Start your coding journey with 200+ carefully curated problems. Perfect for turning 'Hello World' into 'Hello, Competitive Programming!'"
          />
          <ProgramCard
            icon={<Brain className="h-6 w-6" />}
            title="Juniors"
            description="Level up with core problem-solving techniques. Transform those 'Why doesn't my code work?' moments into 'Look at my elegant solution!'"
          />
          <ProgramCard
            icon={<Rocket className="h-6 w-6" />}
            title="Seniors"
            description="Master advanced algorithms and tackle mind-bending challenges. Warning: May cause excessive coding enthusiasm!"
          />
        </div>
      </section>

      {/* Objectives */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Our Objectives</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Target className="h-5 w-5" />
              Community Objectives
            </h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Build Problem-Solving Skills</li>
              <li>• Prepare for Competitions</li>
              <li>• Provide Organized Learning</li>
              <li>• Create Career Connections</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Platform Objectives
            </h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• One Central Platform</li>
              <li>• Scalable Training System</li>
              <li>• AI Support</li>
              <li>• Real-Time Progress Tracking</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Development Team */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Development Team</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Users className="h-5 w-5" />
              Project Developers
            </h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Omar Abdelrahman Abbas</li>
              <li>• Mohamed Khaled Mohamed</li>
              <li>• Mohamed Reda Hassanein</li>
              <li>• Sherif Ashraf Ali</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Project Supervision
            </h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Dr. Mamdouh Farouk</li>
            </ul>
            <div className="pt-4">
              <h4 className="font-medium flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Faculty of Computers and Artificial Intelligence
              </h4>
              <p className="text-muted-foreground">Assiut University</p>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Achievements and Impact</h2>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Our community consistently qualifies teams for prestigious contests like ECPC, ACPC, and ICPC.
            Our alumni have gone on to conquer the tech world, landing roles at giants like Microsoft, Amazon,
            and Huawei. But we&apos;re not just creating programmers – we&apos;re building a community of problem
            solvers who can tackle any challenge, debug any error, and maybe even fix the office printer!
            (Okay, maybe not the printer... those are beyond anyone&apos;s skills 🖨️)
          </p>
        </div>
      </section>

      {/* Contact Section - New */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Get in Touch</h2>
        <div className="flex gap-4">
          <Link 
            href="https://www.facebook.com/icpcassiutt/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <Facebook className="h-5 w-5" />
            <span>Follow us on Facebook</span>
          </Link>
          <Link 
            href="https://eg.linkedin.com/company/icpc-assiut"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <Linkedin className="h-5 w-5" />
            <span>Follow us on LinkedIn</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="p-6 space-y-2">
      <div className="flex items-center gap-2">
        <div className="text-primary">{icon}</div>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Card>
  );
}

function ProgramCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="p-6 space-y-2">
      <div className="flex items-center gap-2">
        <div className="text-primary">{icon}</div>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Card>
  );
} 