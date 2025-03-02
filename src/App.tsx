import "./App.css";
import Seats from "./components/Seats";
import {useEffect, useState} from "react";

function App() {

    const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>(localStorage.theme as 'light' | 'dark' | 'auto' || 'auto');

    useEffect(() => {
        document.documentElement.classList.toggle(
            'dark',
            localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
        )
    }, [])

    useEffect(() => {
        if (theme === 'auto') {
            localStorage.removeItem('theme');
            // document.documentElement.classList.remove('dark');
        } else {
            localStorage.theme = theme;
            // document.documentElement.classList.toggle('dark', theme === 'dark');
        }

        document.documentElement.classList.toggle(
            'dark',
            localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
        )
    }, [theme])


  return (
    <div className="bg-white dark:bg-gray-900 text-gray-950 dark:text-white min-h-screen">
        <div className="max-w-2xl mx-auto p-4 ">
            <div className={"flex justify-between items-center  mb-4"}>
                <h1 className="text-2xl font-bold">Parliament</h1>
                <select
                    className="px-2 py-1 border-2 rounded-lg border-gray-200 dark:border-gray-700 appearance-none bg-white dark:bg-gray-900"
                    value={theme} title={"Appearance"} onChange={
                    (e) => setTheme(e.target.value as 'light' | 'dark' | 'auto')
                }>
                    <option value={'light'}>Light</option>
                    <option value={'dark'}>Dark</option>
                    <option value={'auto'}>Auto</option>
                </select>

            </div>
            <Seats/>
            <div className={"mt-4 italic opacity-75"}>
                <p>
                    Feel free to contact me through <a className={"underline hover:no-underline"} href={"https://disfordave.com#contact"} rel={"noreferrer noopener"} target={"_blank"}>my website</a> if you have any issues or suggestions.
                </p>
            </div>
            <footer className={"p-8 text-center"}>
                <p>&copy; {new Date().getFullYear()} <a className={"hover:underline no-underline"} href={"https://disfordave.com"} rel={"noreferrer noopener"} target={"_blank"}>@disfordave</a> </p>
            </footer>
        </div>
    </div>
  );
}

export default App;
