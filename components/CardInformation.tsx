export default function CardInformation() {
    return (
        <><section className="bg-slate-950 dark:bg-gray-900">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="grid gap-8 lg:grid-cols-2">
                    <article className="p-6 bg-slate-800 rounded-lg border border-gray-700 shadow-md dark:bg-gray-800 dark:border-gray-700">
                        <img className="w-full" src="/gaiacoin-transparent.png" />
                        <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-100 dark:text-white"><a href="#">Gaia Terminal</a></h2>
                        <p className="mb-5 font-light text-gray-200 dark:text-gray-400">Top-tier Research Content: Leverage our open research resources to gain insights into market trends, investment opportunities, and sustainable practices in mining.</p>
                        <div className="flex justify-between items-center">
                            <a href="#" className="flex justify-center items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                Create account</a>
                        </div>
                    </article>
                    <article className="p-6 bg-slate-800 rounded-lg border border-gray-700  shadow-md dark:bg-gray-800 dark:border-gray-700">
                        <img className="w-full" src="/spidermine_logo-photoroom.png" />
                        <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-100 dark:text-white"><a href="#">SpiderMine Platform</a></h2>
                        <p className="mb-5 font-light text-gray-200 dark:text-gray-400">Integrated Investor Engagement Platform: Our digital twin solution for sustainable mining investments streamlines the fundraising process and connects like-minded investors to prominent sustainable mining projects.</p>
                        <div className="flex justify-between items-center">
                            <a href="#" className="flex justify-center items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                Submit project
                            </a>
                        </div>
                    </article>
                </div>
            </div>
        </section></>
    )
}