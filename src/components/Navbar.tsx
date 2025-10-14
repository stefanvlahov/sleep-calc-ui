import { useAuth } from "../hooks/useAuth.ts";
import userAvatar from '../assets/userAvatar.png'
import moonImage from '../assets/moon.jpeg'

function Navbar() {
    const { logout } = useAuth()

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="mx-auto max-w-7xl px-4 lg:px-8">
                <div className="flex h-16 justify-between">
                    <div className="flex items-center">
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <img src={moonImage} className="w-6 h-6 rounded-full" alt="Moon icon"/>
                            <span className="text-xl font-bold text-gray-900">SleepTracker</span>
                        </div>
                        <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                            <a href="#" className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-900 hover:border-gray-300 hover:text-gray-700">
                                Dashboard
                            </a>
                            <a href="#" className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
                                History
                            </a>
                            <a href="#" className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
                                Reports
                            </a>
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center gap-4">
                        <button
                            type="button"
                            onClick={logout}
                            className="rounded-md border border-gray-300 bg-white px-3 py-2 test-sm font-semibold text-gray-700 shadow-sm hover:border-blue-500 hover:text-blue-600"
                            >Logout
                        </button>
                        <div className="relative">
                            <img src={userAvatar} className="w-10 h-10 rounded-full" alt="User Avatar"/>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;