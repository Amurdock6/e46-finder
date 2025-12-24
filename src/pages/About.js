import NavBar from '../componets/NavBar/NavBar'
import Footer from '../componets/Footer/Footer'
import '../css/AboutStyle.css'

function About() {
    return (
    <>
      <NavBar />
      <div className="article-wrapper"> 
          <article>
            <h6>About E46 Finder</h6>

            <p>
              E46 Finder is a passion project of mine. I first came up with the idea of E46 finder when thinking of
              potential projects I could add to my resume to help get me a web dev job.
              With E46 finder I am able to combine my favourite things: cars and coding and not just any ordinary cars. One of my favourite cars the BMW E46 3 series.
              I also realised that with my project I could contribute to the E46 community and create a hub for E46 enthusiast to find E46s by providing a place
              for enthusiasts to find their dream car without having to jump from website to website trying to find the perfect car for them. So I created
              E46 finder a web app that scrapes the web for all E46 listings and puts them in one easy to access website.
            </p>

            <h6>How Does E46 Finder work?</h6>

            <p>
              E46 finder uses a web scraper coded in Node.js to scrape various popular car listing sites to find E46 listings and put that listing information onto the E46 website so users can easily find
              what they are looking for all on one site. E46 Finder was programed using the MERN tech stack and is deployed acrossed Google Cloud Services, and Google Cloud Jobs, Netlify, and MongoDB.
            </p>
          </article>
      </div>
      <Footer />
    </>  
    )
  }
  

  export default About;