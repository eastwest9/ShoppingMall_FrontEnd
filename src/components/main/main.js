import { EventBanner } from "../eventBanner/eventBanner";
import { useEffect, useState } from "react";
import { Product } from "../product/product";
import TabBar from "../navigationbar/TabBar";
import axiosInstance from "../../service/axiosInstance";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Main = ({ convertPrice }) => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 6;

    const [end, setEnd] = useState(false);
    const [moreLoading, setMoreLoading] = useState(true);

    useEffect(() => {
        // 페이지가 변경될 때마다 데이터를 가져옵니다.
        if(currentPage === 0) {
            setIsLoading(true);
        } else {
            setMoreLoading(false);
        }
        axiosInstance.get(`/api/product/list/${currentPage}`)
            .then(res => {
                setProducts(prevProducts => [
                    ...prevProducts,
                    ...res.data.data.list
                ]);

                if(res.data.data.list.length === 0) {
                    setEnd(true);
                }

                if(currentPage === 0) {
                    setIsLoading(false);
                }
                setMoreLoading(true);
            })
            .catch(err => {
                console.log(err);
                if(currentPage === 0) {
                    setIsLoading(false);
                } else {
                    setMoreLoading(false);
                }
            });
    }, [currentPage]); // currentPage가 변경될 때마다 실행

    const loadMore = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    return (
        <div>
            {/*<TabBar />*/}
            <EventBanner />
            <div className="container mt-5 mx-auto ml-4 text-lg md:text-2xl md:mx-auto lg:my-6 lg:text-4xl lg:mx-auto"
                 style={{ fontFamily: 'sb' }}>
                👋 이런 상품들이 있어요.
            </div>

            <div className={`container pl-3 pr-3 max-w-screen-lg xl:max-w-screen-2xl mx-auto mt-6 grid md:grid-cols-3 sm:grid-cols-3 grid-cols-3 place-items-center gap-x-3 md:gap-x-10 gap-y-0.5 transition-opacity duration-500 ${isLoading ? 'opacity-70' : 'opacity-100'}`}>
                {isLoading
                    ? Array.from({ length: itemsPerPage }).map((_, index) => (
                        <div key={index} className="flex w-80 h-80 lg:w-72 lg:h-72 xl:w-96 xl:h-96 flex-col gap-4 animate-pulse">
                            <div className="bg-gray-200 h-72 lg:h-80 w-full rounded-md"></div>
                            <div className="bg-gray-200 h-4 w-28 rounded-md"></div>
                            <div className="bg-gray-200 h-4 w-full rounded-md"></div>
                            <div className="bg-gray-200 h-4 w-full rounded-md"></div>
                        </div>
                    ))
                    : products.map((product) => (
                        <Product
                            key={`key-${product.id}`}
                            product={product}
                            convertPrice={convertPrice}
                        />
                    ))
                }
            </div>

            {!isLoading && !end && (
                <div className="flex justify-center mb-12">
                    <button
                        onClick={loadMore}
                        className="btn btn-outline w-80 md:w-96 text-black bg-white rounded-xl"
                    >
                        {
                            moreLoading ?
                                (<FontAwesomeIcon icon={faArrowDown} />) :
                                (<span className="loading loading-dots loading-sm"></span>)
                        }
                    </button>
                </div>
            )}
        </div>
    );
};
