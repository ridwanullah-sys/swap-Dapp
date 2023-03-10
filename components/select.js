import { useEffect, useState } from "react"
import defaultTokenList from "../Utils/tokenList.json"
import { BiSearchAlt2 } from "react-icons/bi"
const fleekStorage = require("@fleekhq/fleek-storage-js")

export const Select = ({
    showModal,
    setShowModal,
    tokenNum,
    setToken1,
    setToken2,
    setTokenInputAddress,
    setTokenOutputAddress,
    setInputDecimal,
    setOutputDecimal,
}) => {
    const [completeList, setCompleteList] = useState(defaultTokenList)
    const [lists, setLists] = useState(completeList)
    const API_SECRET = process.env.NEXT_PUBLIC_FLEEK_API_SECRET
    const API_KEY = process.env.NEXT_PUBLIC_FLEEK_API_KEY

    const getTokens = async () => {
        try {
            const enc = new TextDecoder("utf-8")
            const myFile = await fleekStorage.get({
                apiKey: API_KEY,
                apiSecret: API_SECRET,
                key: `tokenList`,
                getOptions: ["data"],
            })
            const data = JSON.parse(enc.decode(myFile.data))
            return data
        } catch (e) {
            console.log(e.message)
            return null
        }
    }

    const setTokenList = async () => {
        await getTokens().then((result) => {
            result ? setCompleteList(result) : null
        })
    }

    useEffect(() => {
        setTokenList()
    }, [])

    const getList = (search) => {
        const ListofOptions = completeList
        const listArray = []
        ListofOptions.forEach((option) => {
            if (option.symbol.toLowerCase().includes(search.toLowerCase())) {
                listArray.push(option)
            }
        })

        setLists(listArray)
    }

    const handle = (e) => {
        if (e.target.id === "wrapper") {
            setShowModal(false)
            setLists(completeList)
        }
    }

    if (showModal == false) {
        return null
    }

    return (
        <div
            className=" fixed inset-0 backdrop-blur-sm bg-opacity-25 flex justify-center pt-20"
            onClick={(e) => {
                handle(e)
            }}
            id="wrapper"
        >
            <div className="bg-slate-700 sm:w-80 w-4/5 rounded-lg h-fit">
                <div className="grid grid-cols-9 py-3">
                    <BiSearchAlt2 className="self-center justify-self-center col-span-1 text-slate-300" />
                    <input
                        className="col-span-8 outline-none bg-slate-700 text-slate-300 font-semibold text-xl"
                        placeholder="search token"
                        onChange={(e) => {
                            getList(e.target.value)
                        }}
                        type="text"
                    ></input>
                </div>
                <hr className="mx-4 border-slate-400" />
                <div className="overflow-auto h-72">
                    <ul className="">
                        {lists.length <= 0 ? (
                            <div className="text-slate-100 m-4"> No March</div>
                        ) : (
                            lists.map((Option) => {
                                return (
                                    <div key={lists.indexOf(Option)}>
                                        <li
                                            className=" p-3 hover:bg-slate-500 flex justify-right text-white text-xl font-semibold"
                                            onClick={() => {
                                                if (tokenNum == 2) {
                                                    setToken2(Option.symbol)
                                                    setTokenOutputAddress(Option.address)
                                                    setOutputDecimal(Option.decimals)
                                                } else if (tokenNum == 1) {
                                                    setToken1(Option.symbol)
                                                    setTokenInputAddress(Option.address)
                                                    setInputDecimal(Option.decimals)
                                                }
                                                setShowModal(false)
                                                setLists(completeList)
                                            }}
                                        >
                                            <div>{Option.symbol}</div>
                                        </li>
                                    </div>
                                )
                            })
                        )}
                    </ul>
                </div>
            </div>
        </div>
    )
}
