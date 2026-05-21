import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";

const ListContext = createContext();

export const ListProvider = ({ children }) => {
  const [activeProfile, setActiveProfile] = useState(() => {
    const savedProfile = localStorage.getItem("activeProfile");
    return savedProfile ? JSON.parse(savedProfile) : null;
  });

  const [myList, setMyList] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [listsLoaded, setListsLoaded] = useState(false);

    const userId = auth.currentUser?.uid || localStorage.getItem("activeUserId");
    const profileId = activeProfile?.id;

    const storageKey = userId && profileId ? `${userId}_${profileId}` : null;
  
    useEffect(() => {
        if (!storageKey) return;

        setListsLoaded(false);

        const savedMyList = localStorage.getItem(`myList_${storageKey}`);
        const savedFavorites = localStorage.getItem(`favorites_${storageKey}`);

        setMyList(savedMyList ? JSON.parse(savedMyList) : []);
        setFavorites(savedFavorites ? JSON.parse(savedFavorites) : []);

        setListsLoaded(true);
        }, [storageKey]);

  useEffect(() => {
    if (!storageKey || !listsLoaded) return;

    localStorage.setItem(`myList_${storageKey}`, JSON.stringify(myList));
  }, [myList, storageKey, listsLoaded]);

  useEffect(() => {
    if (!storageKey || !listsLoaded) return;

    localStorage.setItem(`favorites_${storageKey}`, JSON.stringify(favorites));
  }, [favorites, storageKey, listsLoaded]);

  const chooseProfile = (profile) => {
    setActiveProfile(profile);
    localStorage.setItem("activeProfile", JSON.stringify(profile));
  };

  const addToMyList = (movie) => {
    if (!storageKey) return;

    setMyList((prevList) => {
      const alreadyAdded = prevList.some((item) => item.id === movie.id);

      if (alreadyAdded) {
        return prevList.filter((item) => item.id !== movie.id);
      }

      return [...prevList, movie];
    });

    // const addToMyList = (movie) => {
    // console.log("ADDING TO MY LIST");
    // console.log("activeProfile:", activeProfile);
    // console.log("storageKey:", storageKey);

    // if (!storageKey) return;

    setMyList((prevList) => {
        const alreadyAdded = prevList.some((item) => item.id === movie.id);

        if (alreadyAdded) {
        return prevList.filter((item) => item.id !== movie.id);
        }

        return [...prevList, movie];
    });
    };

  const addToFavorites = (movie) => {
    if (!storageKey) return;

    setFavorites((prevFavorites) => {
      const alreadyAdded = prevFavorites.some((item) => item.id === movie.id);

      if (alreadyAdded) {
        return prevFavorites.filter((item) => item.id !== movie.id);
      }

      return [...prevFavorites, movie];
    });
  };

  return (
    <ListContext.Provider
      value={{
        activeProfile,
        chooseProfile,
        myList,
        favorites,
        addToMyList,
        addToFavorites,
      }}
    >
      {children}
    </ListContext.Provider>
  );
};


export const useLists = () => {
  return useContext(ListContext);
};