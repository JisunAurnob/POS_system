import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Layout from "../layouts/Layout";

const Template = () => {

  useEffect(() => {
    document.title = "Ultimate Organic Life - Template";
    window.scrollTo(0, 0);

  }, []);
  // useEffect(() => {
  //   if(isLoggedIn){
  //     axios.get("get-wishlist/" + user.customer_id)
  //     .then(resp => {
  //       // console.log(resp.data.data);
  //       if(resp.data.success==true){
  //       dispatch(incrementByAmount(resp.data.data.length));
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  //   }
  // }, []);
  return (
    <div>
      <Layout>
                {/* {gradeWiseCourses && (
                  gradeWiseCourses.courses.map((course, index) => {
                    return (
                      <Col key={index} sm={6} md={4} className="text-center coding_course_card">
                        <h3>{course.title}</h3>
                        <p><b>Class Number: {course.class_numbers}</b></p>
                        <p>{course.description}</p>
                        {course.topics.map((topic, index) => {
                          return (
                            <li key={index} className="text-start">{topic.name}</li>
                          );
                        })}
                      </Col>
                    );
                  })
                )} */}
      </Layout>
    </div>
  );
};

export default Template;
