import React, { useState, useMemo, useEffect } from 'react';
import { Container, Box, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion'; // Import our separate slide components
import { ProductInfoSlide } from './book-detail-slides/ProductInfoSlide';
import { ParticipantsSlide } from './book-detail-slides/ParticipantsSlide';
import { DetailsSlide } from './book-detail-slides/DetailsSlide';
import { TableOfContentsSlide } from './book-detail-slides/TableOfContentsSlide';
import { CertificatesSlide } from './book-detail-slides/CertificatesSlide';
import StickyTabNavigation from '../components/ui/StickyTabNavigation';
import { getQueryParam } from '../utils/urlHelpers';
import { useContext } from 'react';
import { ApiContext } from '../context/ApiProvider';
import { useLocation, useParams } from 'react-router-dom';

export default function BookDetailPage() {
  const { bookId } = useParams();
  const { fetchBookbyID, bookData } = useContext(ApiContext);

  useEffect(() => {
    fetchBookbyID(bookId);
  }, [bookId]);

  const book = bookData || mockBookData;
  // This check prevents any crashes. The component will not render until the data is ready.
  console.log(bookData)
  if (!book) {
    return <Typography>Loading...</Typography>;
  }
  // --- ALL STATE AND LOGIC LIVES IN THE PARENT COMPONENT ---
  const book = bookData;
  const formats = book?.formats || [];
  
  const slideVariants = { enter: (direction) => ({ x: direction > 0 ? '100vw' : '-100vw', opacity: 0 }), center: { zIndex: 1, x: 0, opacity: 1 }, exit: (direction) => ({ zIndex: 0, x: direction < 0 ? '100vw' : '-100vw', opacity: 0 }), };
  // -----------------------------
  // State
  // -----------------------------
  const [activeSlide, setActiveSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const [selectedBinding, setSelectedBinding] = useState("");
  const [selectedQuality, setSelectedQuality] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [isAffiliateLink, setIsAffiliateLink] = useState(false);

  // Set affiliate flag
  useEffect(() => {
    const refCode = getQueryParam("ref");
    if (refCode) {
      setIsAffiliateLink(true);
    }
  }, []);

  // Initialize selected format when book loads
  useEffect(() => {
    if (!formats.length) return;

    setSelectedBinding(formats[0].binding_type);
    setSelectedQuality(formats[0].quality || "Standard");
    setSelectedLanguage(formats[0].language);
  }, [formats]);

  // -----------------------------
  // Memoized values
  // -----------------------------
  const availableBindings = useMemo(() => {
    return [...new Set(formats.map((f) => f.binding_type))];
  }, [formats]);

  const availableQualities = useMemo(() => {
    return [
      ...new Set(
        formats
          .filter((f) => f.binding_type === selectedBinding)
          .map((f) => f.quality)
      ),
    ];
  }, [formats, selectedBinding]);

  const availableLanguages = useMemo(() => {
    return [
      ...new Set(
        formats
          .filter(
            (f) =>
              f.binding_type === selectedBinding &&
              f.quality === selectedQuality
          )
          .map((f) => f.language)
      ),
    ];
  }, [formats, selectedBinding, selectedQuality]);

  const selectedFormat = useMemo(() => {
    return (
      formats.find(
        (f) =>
          f.binding_type === selectedBinding &&
          f.quality === selectedQuality &&
          f.language === selectedLanguage
      ) || null
    );
  }, [formats, selectedBinding, selectedQuality, selectedLanguage]);

  const priceDetails = useMemo(() => {
    if (!selectedFormat) {
      return {
        displayPrice: "N/A",
        originalPrice: null,
        discount: null,
        isSale: false,
      };
    }

    const mrp = parseFloat(selectedFormat.mrp);
    let salePrice = mrp;
    let discountText = null;

    if (selectedFormat.sale_type && selectedFormat.sale_value) {
      if (selectedFormat.sale_type === "percentage") {
        salePrice =
          mrp * (1 - parseFloat(selectedFormat.sale_value) / 100);
        discountText = `${selectedFormat.sale_value}% off`;
      } else if (selectedFormat.sale_type === "flat") {
        salePrice = mrp - parseFloat(selectedFormat.sale_value);
        const percentOff = Math.round(((mrp - salePrice) / mrp) * 100);
        discountText = `${percentOff}% off`;
      }
    }

    let finalPrice = salePrice;

    if (
      isAffiliateLink &&
      selectedFormat.affiliate_discount_percentage
    ) {
      finalPrice =
        salePrice *
        (1 -
          parseFloat(
            selectedFormat.affiliate_discount_percentage
          ) /
          100);
    }

    return {
      displayPrice: `₹${Math.round(finalPrice)}`,
      originalPrice: `₹${Math.round(mrp)}`,
      discount: discountText,
      isSale: finalPrice < mrp,
    };
  }, [selectedFormat, isAffiliateLink]);

  // -----------------------------
  // Handlers
  // -----------------------------
  const handleBindingChange = (event, newBinding) => {
    if (!newBinding) return;

    setSelectedBinding(newBinding);

    const firstQuality =
      formats.find((f) => f.binding_type === newBinding)?.quality ||
      "Standard";

    setSelectedQuality(firstQuality);

    const firstLanguage = formats.find(
      (f) =>
        f.binding_type === newBinding &&
        f.quality === firstQuality
    )?.language;

    setSelectedLanguage(firstLanguage);
  };

  const handleQualityChange = (event, newQuality) => {
    if (!newQuality) return;

    setSelectedQuality(newQuality);

    const firstLanguage = formats.find(
      (f) =>
        f.binding_type === selectedBinding &&
        f.quality === newQuality
    )?.language;

    setSelectedLanguage(firstLanguage);
  };

  const handleLanguageChange = (event, newLanguage) => {
    if (!newLanguage) return;
    setSelectedLanguage(newLanguage);
  };

  // -----------------------------
  // Show loader AFTER all hooks
  // -----------------------------
  if (!book) {
    return <Typography>Loading...</Typography>;
  }

  const slides = [
    <ProductInfoSlide
      key="product-info"
      book={book}
      selectedFormat={selectedFormat}
      priceDetails={priceDetails}
      availableBindings={availableBindings}
      selectedBinding={selectedBinding}
      handleBindingChange={handleBindingChange}
      availableQualities={availableQualities}
      selectedQuality={selectedQuality}
      handleQualityChange={handleQualityChange}
      availableLanguages={availableLanguages}
      selectedLanguage={selectedLanguage}
      handleLanguageChange={handleLanguageChange}
      isAffiliateLink={isAffiliateLink}
    />,
    <ParticipantsSlide
      key="participants"
      participants={book.participants}
    />,
    <DetailsSlide
      key="details"
      book={book}
      selectedFormat={selectedFormat}
    />,
    <TableOfContentsSlide key="toc" book={book} />,
    <CertificatesSlide key="certs" />,
  ];

  const setSlide = (newSlide) => {
    const newDirection = newSlide > activeSlide ? 1 : -1;
    setDirection(newDirection);
    setActiveSlide(newSlide);
  };

  return (
    <>
      <StickyTabNavigation
        activeSlide={activeSlide}
        setActiveSlide={setSlide}
      />

      <Container
        maxWidth={false}
        disableGutters
        sx={{
          height: "calc(100vh - 64px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={activeSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: {
                type: "spring",
                stiffness: 300,
                damping: 30,
              },
              opacity: {
                duration: 0.2,
              },
            }}
            style={{
              position: "absolute",
              width: "100%",
              padding: "0 5%",
            }}
          >
            {slides[activeSlide]}
          </motion.div>
        </AnimatePresence>
      </Container>
    </>
  );
}