
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RevealText } from "@/components/ui/RevealText";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Calculator, LineChart, TrendingUp } from "lucide-react";

const Finance = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-20 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealText as="h1" className="heading-lg text-center mb-4">
              AI for <span className="text-gradient">Finance</span>
            </RevealText>
            <RevealText 
              as="p" 
              className="text-xl text-muted-foreground text-center max-w-2xl mx-auto" 
              delay={200}
            >
              Powerful artificial intelligence tools for financial analysis and planning
            </RevealText>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-primary" /> Market Analysis
                  </CardTitle>
                  <CardDescription>AI-powered market insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Get real-time analysis of market trends, sentiment analysis, and predictive forecasts to make informed investment decisions.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="h-5 w-5 mr-2 text-primary" /> Financial Planning
                  </CardTitle>
                  <CardDescription>Personalized financial strategies</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Create customized financial plans with our AI assistant that understands your goals, risk tolerance, and financial situation.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-primary" /> Risk Assessment
                  </CardTitle>
                  <CardDescription>Advanced risk modeling</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Identify potential risks in your portfolio with sophisticated AI models that analyze multiple risk factors and scenarios.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LineChart className="h-5 w-5 mr-2 text-primary" /> Performance Tracking
                  </CardTitle>
                  <CardDescription>Intelligent portfolio monitoring</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Track your investments with AI tools that provide meaningful insights on performance, attribution, and optimization.
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

export default Finance;
