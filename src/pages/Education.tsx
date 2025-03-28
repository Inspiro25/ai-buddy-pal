
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RevealText } from "@/components/ui/RevealText";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, GraduationCap, Library, PenTool } from "lucide-react";

const Education = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-20 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealText as="h1" className="heading-lg text-center mb-4">
              AI for <span className="text-gradient">Education</span>
            </RevealText>
            <RevealText 
              as="p" 
              className="text-xl text-muted-foreground text-center max-w-2xl mx-auto" 
              delay={200}
            >
              Transform learning experiences with artificial intelligence
            </RevealText>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <GraduationCap className="h-5 w-5 mr-2 text-primary" /> AI Tutoring
                  </CardTitle>
                  <CardDescription>Personalized learning assistance</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Get one-on-one help with challenging subjects from our AI tutors that adapt to your learning style and pace.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-primary" /> Curriculum Generation
                  </CardTitle>
                  <CardDescription>Custom learning materials</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Create tailored lesson plans, worksheets, and educational content with our AI curriculum generation tools.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PenTool className="h-5 w-5 mr-2 text-primary" /> Writing Assistance
                  </CardTitle>
                  <CardDescription>Academic writing support</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Improve your essays, research papers, and written assignments with AI-powered writing tools that offer suggestions and feedback.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Library className="h-5 w-5 mr-2 text-primary" /> Research Assistant
                  </CardTitle>
                  <CardDescription>AI-powered research tools</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Find relevant sources, summarize information, and organize research materials efficiently with our AI research assistant.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Education;
