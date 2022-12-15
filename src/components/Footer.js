import "../dist/output.css"

const Footer = () => {
    return (

    <footer className="bg-veryDarkBlue">
        <div className="container flex flex-col-reverse justify-between px-6 py-4 mx-auto space-y-4 md:flex-row md:space-y-0">
            <div className="flex flex-col-reverse items-center justify-between space-y-4 md:flex-col md:space-y-0 md:items-start">
                <div className="mx-auto my-6 text-center text-white md:hidden">
                    Copyright &copy; 2022, All Rights Reserved
                </div>
                <div>
                    <a href="main.html"><img src="https://flowbook.dev/logo2.png" alt="" className="h-24" /></a>
                </div>
                <div className="flex justify-center space-x-4">
                    <a href="http://www.twitter.com" aria-label="twitter logo">
                    <img src="https://upload.wikimedia.org/wikipedia/sco/thumb/9/9f/Twitter_bird_logo_2012.svg/1200px-Twitter_bird_logo_2012.svg.png" alt="" className="h-8 mt-12" />
                    </a>
                </div>
            </div>


            <div className="flex justify-around space-x-32">
                <div className="flex flex-col space-y-3 text-white">
                    <a href="main.html" className="hover:text-fuchsia-600">Token Games</a>
                    <a href="index.js" className="hover:text-fuchsia-600">CoinFlip</a>
                </div>
                <div className="flex flex-col space-y-3 text-white">
                    <img src="https://nbatopshot.com/static/img/flow.svg" alt=""/>
                </div>
            </div>
        </div>
    </footer>

    )
}
  
export default Footer