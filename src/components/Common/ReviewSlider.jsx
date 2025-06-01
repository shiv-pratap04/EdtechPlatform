import React, { useEffect, useState } from "react";
import ReactStars from "react-rating-stars-component";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "../../App.css";
import { FaStar } from "react-icons/fa";
import { Autoplay, FreeMode, Pagination } from "swiper";
import { apiConnector } from "../../services/apiConnector";
import { ratingsEndpoints } from "../../services/apis";

function ReviewSlider() {
  const [reviews, setReviews] = useState([]);
  const MAX_REVIEWS = 10;

  useEffect(() => {
    (async () => {
      try {
        const { data } = await apiConnector(
          "GET",
          ratingsEndpoints.REVIEWS_DETAILS_API
        );
        if (data?.success) {
          setReviews(data?.data);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    })();
  }, []);

  return (
    <div className="text-white w-full px-4 my-12">
      <div className="max-w-[1200px] mx-auto pb-10">
        <Swiper
          spaceBetween={24}
          loop={true}
          freeMode={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          modules={[FreeMode, Pagination, Autoplay]}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
        >
          {reviews.slice(0, MAX_REVIEWS).map((review, i) => {
            const firstName = review?.user?.firstName || "Unknown";
            const lastName = review?.user?.lastName || "User";
            const fullName = `${firstName} ${lastName}`;
            const avatarUrl = review?.user?.image
              ? review.user.image
              : `https://api.dicebear.com/5.x/initials/svg?seed=${fullName}`;
            const courseName = review?.course?.courseName || "My Course";

            return (
              <SwiperSlide key={i}>
                <div className="flex h-full flex-col justify-between gap-4 rounded-md bg-richblack-800 p-4 text-sm text-richblack-25 shadow-md">
                  {/* User Info */}
                  <div className="flex items-center gap-4">
                    <img
                      src={avatarUrl}
                      alt="user avatar"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <h1 className="font-semibold text-richblack-5">
                        {fullName}
                      </h1>
                      <h2 className="text-xs font-medium text-richblack-400">
                        {courseName}
                      </h2>
                    </div>
                  </div>

                  {/* Review Text */}
                  <p className="line-clamp-3 font-medium text-richblack-25">
                    {review?.review || "No comment"}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mt-auto">
                    <span className="text-yellow-100 font-semibold">
                      {review.rating.toFixed(1)}
                    </span>
                    <ReactStars
                      count={5}
                      value={review.rating}
                      size={20}
                      edit={false}
                      activeColor="#ffd700"
                      emptyIcon={<FaStar />}
                      fullIcon={<FaStar />}
                    />
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}

export default ReviewSlider;
