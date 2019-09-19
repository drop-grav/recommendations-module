import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import RatingStars from './RatingStars';
import * as sc from '../styles/miniPlaceStyles';
import { useCurrentPlaceContext } from '../context/CurrentPlaceContext';


const MiniPlace = (props) => {
  const { place, expanded, toggleExpanded } = props;
  const percent = `${(place.average_review / 5) * 100}%`;
  const [currentPlace] = useCurrentPlaceContext();
  const buttonRef = useRef(null);
  const miniPlaceRef = useRef(null);

  useEffect(() => {
    miniPlaceRef.current.scrollTop = 0;
  }, [currentPlace, expanded]);

  return (
    <sc.MiniPlaceDiv ref={miniPlaceRef} expanded={expanded}>
      <sc.MiniPlaceButton
        onClick={() => { toggleExpanded(); buttonRef.current.blur(); }}
        ref={buttonRef}
      >
        <sc.ArrowDiv expanded={expanded}>
          <sc.CollaspArrow viewBox="0 0 18 18" focusable="false">
            <path d="m16.29 4.3a1 1 0 1 1 1.41 1.42l-8 8a1 1 0 0 1 -1.41 0l-8-8a1 1 0 1 1 1.41-1.42l7.29 7.29z" fillRule="evenodd" />
          </sc.CollaspArrow>
        </sc.ArrowDiv>
        <sc.ImageDescriptionWrapper>
          <sc.StyledMiniImage src={place.url} alt="" />
          <sc.DescriptionDiv>
            <sc.MiniTitle>
              {place.title}
            </sc.MiniTitle>
            <sc.MiniLocation>
              {`${place.city}, ${place.state}, ${place.country}`}
            </sc.MiniLocation>
            <sc.MiniReviews>
              <RatingStars size="1.2em" percent={percent} />
              {` ${place.total_reviews} reviews`}
            </sc.MiniReviews>
          </sc.DescriptionDiv>
        </sc.ImageDescriptionWrapper>
      </sc.MiniPlaceButton>
      <sc.About>
        <sc.AboutHeader>
          About this listing
        </sc.AboutHeader>
        <sc.AboutText>
          {place.about}
        </sc.AboutText>
        <sc.AboutHeader>
          The space
        </sc.AboutHeader>
        <sc.AboutText>
          {place.the_space}
        </sc.AboutText>
        <sc.AboutHeader>
          Neighborhood
        </sc.AboutHeader>
        <sc.AboutText>
          {place.neighborhood}
        </sc.AboutText>
      </sc.About>
    </sc.MiniPlaceDiv>
  );
};

MiniPlace.propTypes = {
  place: PropTypes.shape({
    url: PropTypes.string,
    title: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    country: PropTypes.string,
    about: PropTypes.string,
    the_space: PropTypes.string,
    neighborhood: PropTypes.string,
    averageReview: PropTypes.number,
    totalReviews: PropTypes.number,
  }).isRequired,
  expanded: PropTypes.bool.isRequired,
  toggleExpanded: PropTypes.func.isRequired,
};

export default MiniPlace;
