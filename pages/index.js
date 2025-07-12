
import Hero from '@/components/hero'
import Features from '../components/features';
import About from '../components/about';
import Navbar from '../components/navbar';
import RecipeCarousel from '../components/recipeCarousel';


export default function Home() {
  return (
    
    <main>
      <Hero />
       <Features />
       <About />
       <RecipeCarousel />
       <Navbar />
    </main>
  )
}
