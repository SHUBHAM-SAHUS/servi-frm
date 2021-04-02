import React from "react";

class TaskFileViews extends React.Component {
  render() {
    const { taskFiles } = this.props;
    return (
      <div
        id="licencesSlider"
        className="carousel slide taskfimgModal"
        data-interval="false"
        data-ride="carousel"
      >
        <div className="carousel-inner text-center">
          {taskFiles && taskFiles.length > 0
            ? taskFiles.map((file, index) => {
                return (
                  <div
                    className={
                      index === 0 ? "carousel-item active" : "carousel-item"
                    }
                  >
                    <img
                      src={
                        file && typeof file === "string"
                          ? file
                          : file.file_url
                          ? file.file_url
                          : ""
                      }
                      alt="img"
                    />
                  </div>
                );
              })
            : ""}
        </div>
        <div className="slider-nav">
          <a
            className="carousel-control-prev"
            href="#licencesSlider"
            role="button"
            data-slide="prev"
          >
            <i className="material-icons" aria-hidden="true">
              keyboard_arrow_left
            </i>
          </a>
          <a
            className="carousel-control-next"
            href="#licencesSlider"
            role="button"
            data-slide="next"
          >
            <i className="material-icons" aria-hidden="true">
              keyboard_arrow_right
            </i>
          </a>
        </div>
      </div>
    );
  }
}

export default TaskFileViews;
