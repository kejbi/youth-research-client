import React, { useState, useEffect } from "react";

import { Pagination, PaginationItem, PaginationLink } from "reactstrap";
import classnames from "classnames";

const MyPagination = props => {
  const [pages, setPages] = useState([]);

  const handlePageChange = event => {
    props.handlePageChange(event.target.value);
  };

  useEffect(() => {
    let createdPages = [];
    for (let i = 1; i <= props.totalPages; i++) {
      createdPages.push(i);
    }
    setPages(createdPages);
    console.log(props.current);
  }, [props.totalPages]);

  return (
    <Pagination aria-label='Page navigation example'>
      {pages.map(page => {
        return (
          <PaginationItem
            className={classnames({ active: page === props.current })}
          >
            <PaginationLink value={page} onClick={handlePageChange}>
              {page}
            </PaginationLink>
          </PaginationItem>
        );
      })}
    </Pagination>
  );
};

export default MyPagination;
