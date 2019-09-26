/* eslint-disable no-underscore-dangle */
import React, {
  useState, useEffect, useRef,
} from 'react';
import axios from 'axios';
import SavedListEntry from './SavedListEntry';
import MiniPlace from './MiniPlace';
import NewListForm from './NewListForm';
import * as sc from '../styles/savedListStyles';
import { useCurrentPlaceContext } from '../context/CurrentPlaceContext';
import { useSavedListContext } from '../context/SavedListContext';

const SavedList = () => {
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [currentPlace, setCurrentPlace] = useCurrentPlaceContext();
  const [savedList, setSavedList] = useSavedListContext();

  const exitButtonRef = useRef({ current: {} });
  const scrollableListRef = useRef({ current: {} });

  useEffect(() => {
    exitButtonRef.current.focus();
    document.body.style.overflow = Object.keys(currentPlace).length ? 'hidden' : 'auto';
  }, [Object.keys(currentPlace).length]);

  useEffect(() => {
    axios('http://3.19.69.41/api/saved-lists')
      .then((response) => {
        const savedLists = [];
        for (let i = 0; i < response.length; i++) {
          savedLists.push(response[i].saved_list);
        }

        setSavedList(savedLists);
      });
  }, []);

  const closeModal = () => {
    setShowForm(false);
    setExpanded(false);
    scrollableListRef.current.scrollTop = 0;
    setCurrentPlace({});
  };

  const handleClick = (e) => {
    if (e.target.id === 'StyledSavedList') {
      closeModal();
    }
  };

  const toggleShowForm = () => {
    setShowForm(!showForm);
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  };

  let renderSavedList = null;
  if (currentPlace.savedList) {
    renderSavedList = savedList.map((list) => {
      const favorited = currentPlace.savedList.includes(list.name);
      return (
        <SavedListEntry
          key={list._id}
          favorited={favorited}
          listName={list.name}
        />
      );
    });
  }

  return (
    <sc.StyledSavedList id="StyledSavedList" currentPlace={currentPlace} onClick={handleClick}>
      <sc.MainForm>
        <div>
          <sc.ExitButton onKeyDown={handleKeyDown} ref={exitButtonRef} id="ExitButton" onClick={closeModal}>
            <sc.Exit viewBox="0 0 24 24" focusable="false">
              <path d="m23.25 24c-.19 0-.38-.07-.53-.22l-10.72-10.72-10.72 10.72c-.29.29-.77.29-1.06 0s-.29-.77 0-1.06l10.72-10.72-10.72-10.72c-.29-.29-.29-.77 0-1.06s.77-.29 1.06 0l10.72 10.72 10.72-10.72c.29-.29.77-.29 1.06 0s .29.77 0 1.06l-10.72 10.72 10.72 10.72c.29.29.29.77 0 1.06-.15.15-.34.22-.53.22" fillRule="evenodd" />
            </sc.Exit>
          </sc.ExitButton>
          <sc.SavedListTitle>
          Save to list
          </sc.SavedListTitle>
          <sc.ScrollableList ref={scrollableListRef}>
            <sc.NewList>
              <sc.NewListText
                showForm={showForm}
                id="CreateNewList"
                onClick={toggleShowForm}
              >
                Create New List
              </sc.NewListText>
              <NewListForm
                toggleShowForm={toggleShowForm}
                showForm={showForm}
              />
            </sc.NewList>
            <sc.StyledList>
              {renderSavedList}
            </sc.StyledList>
          </sc.ScrollableList>
        </div>
        <MiniPlace
          toggleExpanded={toggleExpanded}
          expanded={expanded}
          place={currentPlace}
        />
      </sc.MainForm>
    </sc.StyledSavedList>
  );
};

export default SavedList;
