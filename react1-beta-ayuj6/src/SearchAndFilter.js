class SearchAndFilter {
  searchAndFilter(courses, search, subject, minimumCredits, maximumCredits) {
    if (minimumCredits != null && minimumCredits !== "") {
      courses = courses.filter(SearchCourse =>
        SearchCourse.credits >= minimumCredits
      );
    }

    if (maximumCredits != null && maximumCredits !== "") {
      courses = courses.filter(SearchCourse =>
        SearchCourse.credits <= maximumCredits
      );
    }

    if (subject !== "All") {
      courses = courses.filter(SearchCourse =>
        SearchCourse.subject === subject
      );
    }

    if (search != null && search !== "") {
      courses = courses.filter(SearchCourse =>
        SearchCourse.keywords.filter(searchKey =>
          searchKey.toLowerCase().includes(search.toLowerCase())
        ).length > 0
      );
    }
    return courses;
  }
}

export default SearchAndFilter;
