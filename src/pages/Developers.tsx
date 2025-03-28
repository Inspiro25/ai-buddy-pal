
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RevealText } from "@/components/ui/RevealText";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, FileCode, GitBranch, Terminal } from "lucide-react";

const Developers = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-20 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealText as="h1" className="heading-lg text-center mb-4">
              Developers <span className="text-gradient">Hub</span>
            </RevealText>
            <RevealText 
              as="p" 
              className="text-xl text-muted-foreground text-center max-w-2xl mx-auto" 
              delay={200}
            >
              Powerful tools and resources for developers using our AI APIs
            </RevealText>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center">
                    <Code className="h-5 w-5 mr-2 text-primary" /> API Reference
                  </CardTitle>
                  <CardDescription>Comprehensive API documentation</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Explore our REST API endpoints with examples in multiple programming languages.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center">
                    <Terminal className="h-5 w-5 mr-2 text-primary" /> CLI Tools
                  </CardTitle>
                  <CardDescription>Command line interface</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Manage resources, deploy, and test directly from your terminal.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center">
                    <FileCode className="h-5 w-5 mr-2 text-primary" /> SDKs
                  </CardTitle>
                  <CardDescription>Developer kits for all platforms</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Libraries for JavaScript, Python, Java, Ruby, and more.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center">
                    <GitBranch className="h-5 w-5 mr-2 text-primary" /> Integrations
                  </CardTitle>
                  <CardDescription>Connect with other services</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Seamlessly integrate with popular tools and platforms.
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

export default Developers;
