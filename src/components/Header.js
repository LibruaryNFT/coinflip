import "../dist/output.css"

const Header = () => {
    return (

         <nav className="relative container mx-auto p-6">
                  
            <div className="flex items-center justify-between">
                
                 <div className="pt-2">
                     <img src="https://flowbook.dev/logo2.png" className="h-36" />
                 </div>
              
                 <div className="hidden md:flex space-x-12">
                     <a href="#" className="hover:text-fuchsia-600 text-white text-lg font-bold">Home</a>
                     <a href="#" className="hover:text-fuchsia-600 text-white text-lg font-bold">Games</a>
                     <a href="#" className="hover:text-fuchsia-600 text-white text-lg font-bold">News</a>
                 </div>
          
                 <a href="#" className="p-3 px-6 pt-2 text-white bg-purple-600 font-bold rounded-full 
                 baseline hover:bg-brightRedLight md:block">Play CoinFlip!</a>
                 
                 <button id="menu-btn" className="block hamburger md:hidden focus:outline-none ">
                    <span className="hamburger-top"></span>
                    <span className="hamburger-middle"></span>
                    <span className="hamburger-bottom"></span>
                 </button>

            </div>
 
            <div className="md:hidden">
                <div id="menu" className="absolute flex-col items-center hidden self-end py-8 mt-10 space-y-6 
                font-bold bg-white sm:w-auto sm:self-center left-6 right-6 drop-shadow-md">
                <a href="#" id="" className="hover:text-fuchsia-600">Home</a>
                <a href="#" id="" className="hover:text-fuchsia-600">Games</a>
                <a href="#" id="" className="hover:text-fuchsia-600">News</a>
                </div>
            </div>
             
         </nav>
         
    )
}
  
export default Header