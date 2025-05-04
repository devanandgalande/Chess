
export const Button = ({handleOnClick, children}: {handleOnClick: () => void, children: React.ReactNode}) => {
    return <button onClick={handleOnClick}
        className="px-8 py-4 text-2xl bg-green-500
    hover:bg-green-700 text-white font-bold rounded">
        {children}
    </button>
}