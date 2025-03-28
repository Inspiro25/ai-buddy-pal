
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RevealText } from "@/components/ui/RevealText";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Image, Lightbulb, Music, Pencil } from "lucide-react";

const Creative = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-20 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealText as="h1" className="heading-lg text-center mb-4">
              Creative <span className="text-gradient">Studio</span>
            </RevealText>
            <RevealText 
              as="p" 
              className="text-xl text-muted-foreground text-center max-w-2xl mx-auto" 
              delay={200}
            >
              Unleash your creativity with our AI-powered creative tools
            </RevealText>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <Card className="overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center">
                    <Image className="h-5 w-5 mr-2 text-primary" /> AI Image Generation
                  </CardTitle>
                  <CardDescription>Transform text into stunning visuals</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Create custom artwork, illustrations, and imagery from simple text descriptions using our advanced AI image generation tools.
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center">
                    <Pencil className="h-5 w-5 mr-2 text-primary" /> Content Creation
                  </CardTitle>
                  <CardDescription>AI-powered writing assistance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Generate blog posts, marketing copy, stories, and more with our intelligent writing assistant that adapts to your style and tone.
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center">
                    <Music className="h-5 w-5 mr-2 text-primary" /> AI Music Composition
                  </CardTitle>
                  <CardDescription>Create original music with AI</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Compose unique musical pieces in various styles and genres with our AI music generation tools, perfect for content creators.
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2 text-primary" /> Creative Inspiration
                  </CardTitle>
                  <CardDescription>Idea generation and brainstorming</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Overcome creative blocks with our AI-powered brainstorming tools that help generate fresh ideas and innovative concepts.
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

export default Creative;
