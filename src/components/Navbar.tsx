import { useAuth } from "../hooks/useAuth.ts";
import userAvatar from '../assets/userAvatar.png'

function Navbar() {
    const { logout } = useAuth()

    return (
        <nav className="bg-white shadow-sm">
            <div className="mx-auto max-w-7xl px-4 lg:px-8">
                <div className="flex h-16 justify-between">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <span className="text-xl font-bold">SleepTracker</span>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <a href="#" className="inline-flex items-center border-b-2 border-blue-500 px-1 pt-1 text-sm font-medium text-gray-900">
                                Dashboard
                            </a>
                            <a href="#" className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
                                Log Sleep
                            </a>
                            <a href="#" className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
                                History
                            </a>
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        <button
                            type="button"
                            onClick={logout}
                            className="rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2  focus-visible:outline-offset-2 focus-visible:outline-blue-600 mr-4"
                            >Logout
                        </button>
                        <div className="relative">
                            <img src={userAvatar} className="w-8 h-8 rounded-full" alt="User Avatar"/>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;