import React, { useState, useRef, useEffect } from 'react';
<<<<<<< HEAD
import { FaUpload, FaQrcode, FaFile, FaTimes, FaSpinner, FaInfoCircle, FaMars, FaVenus, FaGenderless } from 'react-icons/fa';
=======
import { FaUpload, FaQrcode, FaFile, FaTimes, FaSpinner, FaInfoCircle } from 'react-icons/fa';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
>>>>>>> e5c8af25d6cd5e0b1108cfba295b3e37060ceb90
import useSignupStore from '../../store/signupStore';
import { createWorker } from 'tesseract.js';
import { toast } from 'react-hot-toast';
import { useLanguage } from '../../context/LanguageContext';
import debounce from 'lodash.debounce';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import localSettlements from '../../data/settlements.json';
import Select from 'react-select';
import { Users, Star, Check } from 'lucide-react';

const IDVerification = ({ onComplete }) => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { idVerificationData, updateIdVerificationData } = useSignupStore();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
<<<<<<< HEAD
  const [settlements, setSettlements] = useState([]);
  const [loadingSettlements, setLoadingSettlements] = useState(true);
  const [settlementsError, setSettlementsError] = useState(false);
  const [settlementSearch, setSettlementSearch] = useState('');
=======
  const [selectedLanguage, setSelectedLanguage] = useState('eng+ara+heb+rus');
  const [settlements, setSettlements] = useState([]);
  const [loadingSettlements, setLoadingSettlements] = useState(true);
  const [settlementsError, setSettlementsError] = useState(false);
>>>>>>> e5c8af25d6cd5e0b1108cfba295b3e37060ceb90
  const fileInputRef = useRef(null);

    const isValidIsraeliID = (id) => {
      if (!/^\d{5,9}$/.test(id)) return false;
      // Pad to 9 digits
      id = id.padStart(9, '0');
      let sum = 0;

<<<<<<< HEAD
      for (let i = 0; i < 9; i++) {
        let num = Number(id[i]);
        let multiplied = num * (i % 2 === 0 ? 1 : 2);
        if (multiplied > 9) multiplied -= 9;
        sum += multiplied;
      }

      return sum % 10 === 0;
    };

  const checkIdAvailability = debounce(async (idNumber) => {
    if (!idNumber || idNumber.length !== 9) return;

    try {      
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("idVerification.idNumber", "==", idNumber), where("role", "==", "retiree"));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setErrors((prev) => ({ ...prev, idNumber: "ID number is already registered" }));
        toast.error("ID number is already registered");
=======
  // Fetch available settlements from API
  useEffect(() => {
    const fetchSettlements = async () => {
      try {
        setSettlementsError(false);
        const response = await fetch('/api/settlements');

        if (!response.ok) {
          throw new Error(`Failed to fetch settlements: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setSettlements(data);
      } catch (error) {
        console.error('Error fetching settlements:', error);
        setSettlementsError(true);
        toast.error('Failed to load available settlements. Please try again later.');
      } finally {
        setLoadingSettlements(false);
      }
    };

    fetchSettlements();
  }, []);

  const handleUpload = () => {
    fileInputRef.current.click();
  };

  const processImageWithOCR = async (imageFile) => {
    setIsProcessing(true);
    let worker = null;
    
    try {
      worker = await createWorker();
      await worker.load();
      await worker.loadLanguage(selectedLanguage);
      await worker.initialize(selectedLanguage);
      
      const { data: { text } } = await worker.recognize(imageFile);
      console.log('Extracted OCR text:', text);

      const extractedData = extractDataFromOCR(text);
      if (extractedData) {
        updateIdVerificationData(extractedData);
        toast.success('Data extracted successfully!');
>>>>>>> e5c8af25d6cd5e0b1108cfba295b3e37060ceb90
      } else {
        setErrors((prev) => ({ ...prev, idNumber: "" }));
        toast.success("ID number is available");
      }
<<<<<<< HEAD
=======
    } catch (error) {
      console.error('OCR Error:', error);
      toast.error('Error processing image. Please try again or fill the form manually.');
    } finally {
      if (worker) {
        try {
          await worker.terminate();
        } catch (terminateError) {
          console.error('Error terminating worker:', terminateError);
        }
      }
      setIsProcessing(false);
    }
  };

  const extractDataFromOCR = (text) => {
    console.log('Starting data extraction from:', text);
    const extractedData = {};

    // Split text into lines and normalize
    const lines = text.split(/[\n\r]+/).map(line => 
      line.trim()
        .replace(/[^\w\s.-]/g, ' ') // Replace special chars with space
        .replace(/\s+/g, ' ') // Normalize spaces
        .trim()
    );
    console.log('Processed lines:', lines);

    // Generic name detection
    let nameFound = false;

    // Common name patterns
    const nameIndicators = ['name', 'nom', 'nombre', 'nama', 'имя', 'naam'];
    const namePatterns = [
      // Pattern: "Name: John Smith" or "Name John Smith"
      new RegExp(`(?:${nameIndicators.join('|')})\\s*:?\\s*([A-Za-z]+(?:\\s+[A-Za-z]+){1,3})`, 'i'),
      // Pattern: Just "John Smith" (two or three word name)
      /^([A-Za-z]+(?:\s+[A-Za-z]+){1,2})$/,
      // Pattern: "SMITH, JOHN" (last name, first name format)
      /([A-Za-z]+)\s*,\s*([A-Za-z]+)/
    ];

    // Try each name pattern
    for (const line of lines) {
      if (nameFound) break;

      for (const pattern of namePatterns) {
        const match = line.match(pattern);
        if (match) {
          let firstName, lastName;
          
          if (match[2]) { // If it's in "Last, First" format
            firstName = match[2];
            lastName = match[1];
          } else {
            const nameParts = match[1].trim().split(/\s+/);
            firstName = nameParts[0];
            lastName = nameParts[nameParts.length - 1];
          }

          // Validate name parts
          if (firstName && lastName && 
              firstName.length >= 2 && lastName.length >= 2 &&
              /^[A-Za-z]+$/.test(firstName) && /^[A-Za-z]+$/.test(lastName)) {
            extractedData.firstName = firstName;
            extractedData.lastName = lastName;
            nameFound = true;
            console.log('Found name:', firstName, lastName);
            break;
          }
        }
      }
    }

    if (!nameFound) {
      console.log('Name not detected');
      toast.error('Name could not be detected. Please fill manually.');
    }

    // Generic ID number detection (updated for 9-digit IDs)
    const idPatterns = [
      // 9-digit number pattern
      /\b(\d{9})\b/,
      // General patterns if prefixed by common words
      /(?:ID|Number|No|№|Identity)\s*[:.]?\s*(\d{9})/i,
    ];    

    let idFound = false;
    for (const line of lines) {
      if (idFound) break;

      for (const pattern of idPatterns) {
        const match = line.match(pattern);
        if (match) {
          // Clean the ID number to ensure proper format
          let idNumber = match[1].replace(/\s+/g, '');
          
          // If it matches CNIC format (13 digits), format it properly
          if (idNumber.replace(/\D/g, '').length === 13) {
            const digits = idNumber.replace(/\D/g, '');
            idNumber = `${digits.slice(0,5)}-${digits.slice(5,12)}-${digits.slice(12)}`;
          }

          // Validate that the ID contains only digits and hyphens
          if (/^[\d-]+$/.test(idNumber) && idNumber.replace(/\D/g, '').length >= 5) {
            extractedData.idNumber = idNumber;
            idFound = true;
            console.log('Found ID:', idNumber);
            break;
          }
        }
      }
    }

    if (!idFound) {
      console.log('ID number not detected');
      toast.error('ID number could not be detected. Please fill manually.');
    }

    // Generic date of birth detection
    const datePatterns = [
      // DD.MM.YYYY or DD-MM-YYYY or DD/MM/YYYY
      /(?:birth|dob|born|date|geboren|né[e]?)\s*(?:of|:|\.)?\s*(\d{1,2})[-./](\d{1,2})[-./](\d{4})/i,
      // YYYY-MM-DD
      /(?:birth|dob|born|date|geboren|né[e]?)\s*(?:of|:|\.)?\s*(\d{4})[-./](\d{1,2})[-./](\d{1,2})/i,
      // Just the date patterns without indicators
      /\b(\d{1,2})[-./](\d{1,2})[-./](\d{4})\b/,
      /\b(\d{4})[-./](\d{1,2})[-./](\d{1,2})\b/
    ];

    let dateFound = false;
    for (const line of lines) {
      if (dateFound) break;

      for (const pattern of datePatterns) {
        const match = line.match(pattern);
        if (match) {
          let year, month, day;
          
          if (match[1].length === 4) { // YYYY-MM-DD format
            year = match[1];
            month = match[2];
            day = match[3];
          } else { // DD-MM-YYYY format
            day = match[1];
            month = match[2];
            year = match[3];
          }

          // Validate date
          const date = new Date(year, month - 1, day);
          if (date && date.getFullYear() > 1900 && date.getFullYear() < new Date().getFullYear()) {
            extractedData.dateOfBirth = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            
            // Age validation
            const today = new Date();
            const age = today.getFullYear() - date.getFullYear();
            const monthDiff = today.getMonth() - date.getMonth();
            const finalAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate()) 
              ? age - 1 
              : age;

            if (finalAge < 50) {
              extractedData.ageError = 'Minimum age required is 50 years old';
              setErrors(prev => ({
                ...prev,
                dateOfBirth: 'Minimum age required is 50 years old'
              }));
            }
            
            dateFound = true;
            console.log('Found DOB:', extractedData.dateOfBirth);
            break;
          }
        }
      }
    }

    if (!dateFound) {
      console.log('Date of birth not detected');
      toast.error('Date of birth could not be detected. Please fill manually.');
    }

    // Generic gender detection
    const genderPatterns = [
      // Common gender indicators in various languages
      {
        male: ['male', 'm', 'masculino', 'männlich', 'homme', 'мужской', 'man'],
        female: ['female', 'f', 'femenino', 'weiblich', 'femme', 'женский', 'woman']
      }
    ];

    let genderFound = false;
    for (const line of lines) {
      if (genderFound) break;

      const normalizedLine = line.toLowerCase();
>>>>>>> e5c8af25d6cd5e0b1108cfba295b3e37060ceb90
      
    } catch (error) {
      console.error("Error checking ID number:", error);
      toast.error("Error checking ID number availability");
    }
  }, 500);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'dateOfBirth') {
      // Calculate age when dateOfBirth is updated
      const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return age;
      };

      const age = calculateAge(value);

      // Update idVerificationData with dateOfBirth and age
      updateIdVerificationData({ dateOfBirth: value, age });
    } else if (name === 'idNumber') {
      const cleanValue = value.replace(/\D/g, '');
      const truncatedValue = cleanValue.slice(0, 9);
      updateIdVerificationData({ [name]: truncatedValue });

      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: '' }));
      }

      if (truncatedValue.length === 9) {
        if (!isValidIsraeliID(truncatedValue)) {
          toast.error('Invalid Israeli ID number');
        } else {
          checkIdAvailability(truncatedValue);
        }
      }
    } else {
      updateIdVerificationData({ [name]: value });
      if (name === 'settlement') {
        setSettlementSearch('');
      }
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPG, JPEG, or PNG)');
      return;
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setIsLoading(true);
    try {
      // Create a preview URL for the file
      const previewUrl = URL.createObjectURL(file);
      setPreviewUrl(previewUrl);
      setUploadedFile(file);

      // Process the image with OCR
      await processImageWithOCR(file);
    } catch (error) {
      console.error('Error handling file:', error);
      toast.error('Error processing file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFile = () => {
    if (previewUrl && previewUrl !== 'pdf') {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setUploadedFile(null);
  };

  const handleScan = () => {
    // Implement QR code scanning functionality here
    toast.info('QR code scanning will be implemented soon');
  };

  // Fetch available settlements from local JSON file
  useEffect(() => {
    try {
      setSettlements(localSettlements);
    } catch (error) {
      console.error('Error loading settlements from local file:', error);
      setSettlementsError(true);
    } finally {
      setLoadingSettlements(false);
    }
  }, []);

  const handleUpload = () => {
    fileInputRef.current.click();
  };

  const processImageWithOCR = async (imageFile) => {
    setIsProcessing(true);
    let worker = null;
    
    try {
      worker = await createWorker();
      await worker.load();
      // Use auto-detect languages without user selection
      await worker.loadLanguage('eng+ara+heb+rus');
      await worker.initialize('eng+ara+heb+rus');
      
      const { data: { text } } = await worker.recognize(imageFile);
      console.log('Extracted OCR text:', text);

      const extractedData = extractDataFromOCR(text);
      if (extractedData) {
        updateIdVerificationData(extractedData);
        toast.success('Data extracted successfully!');
      } else {
        toast.error('Could not extract data from image. Please try again.');
      }
    } catch (error) {
      console.error('OCR Error:', error);
      toast.error('Error processing image. Please try again or fill the form manually.');
    } finally {
      if (worker) {
        try {
          await worker.terminate();
        } catch (terminateError) {
          console.error('Error terminating worker:', terminateError);
        }
      }
      setIsProcessing(false);
    }
  };

  const calculateAge = (dateString) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const validateForm = () => {
    const newErrors = {};
<<<<<<< HEAD
    const { firstName, lastName, dateOfBirth, gender, idNumber, settlement } = idVerificationData;
=======
    const { firstName, lastName, dateOfBirth, gender, idNumber,settlement } = idVerificationData;
>>>>>>> e5c8af25d6cd5e0b1108cfba295b3e37060ceb90

    if (!idNumber?.trim()) {
      newErrors.idNumber = t("ID number is required");
    } else if (!/^\d{9}$/.test(idNumber)) {
      newErrors.idNumber = t("ID number must be 9 digits");
    } else if (errors.idNumber) {
      newErrors.idNumber = errors.idNumber;
    }

    if (!firstName?.trim()) {
      newErrors.firstName = t("First name is required");
    }

    if (!lastName?.trim()) {
      newErrors.lastName = t("Last name is required");
    }

    if (!dateOfBirth) {
      newErrors.dateOfBirth = t("Date of birth is required");
    } else {
      const age = calculateAge(dateOfBirth);
      if (age < 50) {
        newErrors.dateOfBirth = t("Minimum age is 50 years");
        toast.error(t("Age requirement not met: minimum age is 50 years"));
      }
    }

<<<<<<< HEAD
    if (!gender) {
      newErrors.gender = "Gender is required";
    }

    if (!settlement) {
      newErrors.settlement = "Settlement is required";
    }
=======
    if (!gender) newErrors.gender = 'Gender is required';
    if (!settlement) newErrors.settlement = 'Settlement is required';
>>>>>>> e5c8af25d6cd5e0b1108cfba295b3e37060ceb90

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onComplete();
    }
  };

<<<<<<< HEAD
  // Add the missing extractDataFromOCR function
  const extractDataFromOCR = (text) => {
    // This is a placeholder function - you'll need to implement the actual OCR data extraction logic
    // based on the format of Israeli ID cards
    try {
      // Example implementation - adjust based on your specific requirements
      const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      
      // You would implement specific parsing logic here based on Israeli ID card format
      // This is just an example structure
      const extractedData = {};
      
      // Look for patterns in the OCR text that match ID card fields
      // This would need to be customized based on actual ID card format
      
      return Object.keys(extractedData).length > 0 ? extractedData : null;
    } catch (error) {
      console.error('Error extracting data from OCR:', error);
      return null;
    }
  };

  // Floating background elements for visual consistency
  const FloatingElements = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute w-32 h-32 top-10 left-10 rounded-full bg-gradient-to-r from-yellow-200/30 to-blue-200/30 animate-pulse" style={{ animationDelay: '0s' }} />
      <div className="absolute w-24 h-24 top-1/3 right-20 rounded-full bg-gradient-to-r from-yellow-200/30 to-blue-200/30 animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute w-40 h-40 bottom-20 left-1/4 rounded-full bg-gradient-to-r from-yellow-200/30 to-blue-200/30 animate-pulse" style={{ animationDelay: '4s' }} />
      <div className="absolute w-20 h-20 bottom-1/3 right-10 rounded-full bg-gradient-to-r from-yellow-200/30 to-blue-200/30 animate-pulse" style={{ animationDelay: '6s' }} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 relative">
      <FloatingElements />

      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 relative z-10">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Users className="w-12 h-12 text-yellow-500 mr-4" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ID Verification
            </h1>
=======


  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md mt-6">
      <h2 className="text-xl sm:text-2xl font-bold text-center mb-6">ID Verification</h2>
      
      {/* Language Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select ID Card Language
        </label>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
      className="w-full px-3 py-2 rounded-md shadow-sm text-sm sm:text-base border-gray-300 focus:border-[#FFD966] focus:ring-[#FFD966]"
    >
      {languageOptions.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
      {/* ID Upload Section */}
      <div className="mb-8">
        <div className="text-center mb-4">
          <p className="text-gray-600 text-sm sm:text-base mb-4">
            Upload or scan your ID for automatic filling, or fill the form manually
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <div className="relative">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png"
                className="hidden"
              />
              <button
                onClick={handleUpload}
                disabled={isLoading || isProcessing}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#FFD966] text-black rounded-lg hover:bg-yellow-400 transition disabled:opacity-50"
              >
                <FaUpload className="text-lg" />
                <span>{isProcessing ? 'Processing...' : 'Upload ID'}</span>
              </button>
            </div>
            
            <button
              onClick={handleScan}
              disabled={isLoading || isProcessing}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#FFD966] text-black rounded-lg hover:bg-yellow-400 transition disabled:opacity-50"
            >
              <FaQrcode className="text-lg" />
              <span>Scan ID</span>
            </button>
>>>>>>> e5c8af25d6cd5e0b1108cfba295b3e37060ceb90
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Please provide your identification details
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* ID & Personal Info Section */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 backdrop-blur-sm bg-white/95">
            <div className="flex items-center mb-6">
              <Star className="w-8 h-8 text-yellow-500 mr-3" />
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Identification Details
                </h3>
                <p className="text-gray-600 text-lg">Enter your ID and personal information</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* ID Number */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  ID Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="idNumber"
                  value={idVerificationData.idNumber || ''}
                  onChange={handleChange}
                  placeholder='Enter 9 digits'
                  maxLength="9"
                  className={`w-full px-3 py-2 rounded-xl shadow-sm text-base transition-colors duration-200 ${
                    errors.idNumber
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-yellow-400 focus:ring-yellow-100'
                  }`}
                />
                {errors.idNumber && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <FaInfoCircle className="flex-shrink-0" />
                    {errors.idNumber}
                  </p>
                )}
              </div>
              {/* First Name */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={idVerificationData.firstName || ''}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-xl shadow-sm text-base transition-colors duration-200 ${
                    errors.firstName
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-yellow-400 focus:ring-yellow-100'
                  }`}
                />
                {errors.firstName && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <FaInfoCircle className="flex-shrink-0" />
                    {errors.firstName}
                  </p>
                )}
              </div>
              {/* Last Name */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={idVerificationData.lastName || ''}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-xl shadow-sm text-base transition-colors duration-200 ${
                    errors.lastName
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-yellow-400 focus:ring-yellow-100'
                  }`}
                />
                {errors.lastName && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <FaInfoCircle className="flex-shrink-0" />
                    {errors.lastName}
                  </p>
                )}
              </div>
              {/* Date of Birth */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={idVerificationData.dateOfBirth || ''}
                  onChange={handleChange}
                  min="1900-01-01"
                  max={new Date().toISOString().split('T')[0]}
                  className={`w-full px-3 py-2 rounded-xl shadow-sm text-base transition-colors duration-200 ${
                    errors.dateOfBirth
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-yellow-400 focus:ring-yellow-100'
                  }`}
                />
                {errors.dateOfBirth && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <FaInfoCircle className="flex-shrink-0" />
                    {errors.dateOfBirth}
                  </p>
                )}
              </div>
            </div>
            {/* Gender Selection */}
            <div className="mt-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div
                  onClick={() => handleChange({ target: { name: 'gender', value: 'male' } })}
                  className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 hover:shadow-md ${
                    idVerificationData.gender === 'male'
                      ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100 shadow-xl shadow-yellow-200/50 scale-105 -translate-y-0.5'
                      : 'border-gray-200 hover:border-yellow-300 hover:bg-gray-50'
                  }`}
                >
                  <FaMars className={`text-2xl ${idVerificationData.gender === 'male' ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span className={`text-base font-semibold ${idVerificationData.gender === 'male' ? 'text-gray-900' : 'text-gray-600'}`}>
                    Male
                  </span>
                  {idVerificationData.gender === 'male' && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-yellow-400 text-white flex items-center justify-center">
                      <Check size={16} />
                    </div>
                  )}
                </div>
                <div
                  onClick={() => handleChange({ target: { name: 'gender', value: 'female' } })}
                  className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 hover:shadow-md ${
                    idVerificationData.gender === 'female'
                      ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100 shadow-xl shadow-yellow-200/50 scale-105 -translate-y-0.5'
                      : 'border-gray-200 hover:border-yellow-300 hover:bg-gray-50'
                  }`}
                >
                  <FaVenus className={`text-2xl ${idVerificationData.gender === 'female' ? 'text-pink-600' : 'text-gray-500'}`} />
                  <span className={`text-base font-semibold ${idVerificationData.gender === 'female' ? 'text-gray-900' : 'text-gray-600'}`}>
                    Female
                  </span>
                  {idVerificationData.gender === 'female' && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-yellow-400 text-white flex items-center justify-center">
                      <Check size={16} />
                    </div>
                  )}
                </div>
                <div
                  onClick={() => handleChange({ target: { name: 'gender', value: 'other' } })}
                  className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 hover:shadow-md ${
                    idVerificationData.gender === 'other'
                      ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100 shadow-xl shadow-yellow-200/50 scale-105 -translate-y-0.5'
                      : 'border-gray-200 hover:border-yellow-300 hover:bg-gray-50'
                  }`}
                >
                  <FaGenderless className={`text-2xl ${idVerificationData.gender === 'other' ? 'text-purple-600' : 'text-gray-500'}`} />
                  <span className={`text-base font-semibold ${idVerificationData.gender === 'other' ? 'text-gray-900' : 'text-gray-600'}`}>
                    Other
                  </span>
                  {idVerificationData.gender === 'other' && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-yellow-400 text-white flex items-center justify-center">
                      <Check size={16} />
                    </div>
                  )}
                </div>
              </div>
              {errors.gender && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-2">
                  <FaInfoCircle className="flex-shrink-0" />
                  {errors.gender}
                </p>
              )}
            </div>
          </div>

          {/* Settlement Section */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 backdrop-blur-sm bg-white/95">
            <div className="flex items-center mb-6">
              <Users className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Settlement
                </h3>
                <p className="text-gray-600 text-lg">Select your place of residence</p>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Settlement <span className="text-red-500">*</span>
              </label>
              {loadingSettlements ? (
                <div className="flex items-center gap-2 text-gray-500">
                  <FaSpinner className="animate-spin" />
                  <span>Loading settlements...</span>
                </div>
              ) : settlementsError ? (
                <div className="text-red-500 flex items-center gap-1">
                  <FaInfoCircle />
                  <span>Failed to load settlements. Please try again later.</span>
                </div>
              ) : (
                <Select
                  options={settlements.map(s => ({
                    value: s.id || s.name,
                    label: s.name || s,
                  }))}
                  value={
                    settlements.find(s => s.id === idVerificationData.settlement || s.name === idVerificationData.settlement)
                      ? {
                          value: idVerificationData.settlement,
                          label:
                            settlements.find(s => s.id === idVerificationData.settlement || s.name === idVerificationData.settlement)
                              ?.name || idVerificationData.settlement,
                        }
                      : null
                  }
                  onChange={(selected) => {
                    updateIdVerificationData({ settlement: selected.value });
                  }}
                  placeholder="Select settlement..."
                  isSearchable
                  className="text-base"
                  classNamePrefix="react-select"
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      borderColor: errors.settlement ? '#ef4444' : '#d1d5db',
                      boxShadow: state.isFocused ? '0 0 0 1px #FFD966' : '',
                      '&:hover': {
                        borderColor: '#FFD966',
                      },
                      minHeight: 44,
                      borderRadius: 12,
                    }),
                  }}
                />
              )}
              {errors.settlement && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <FaInfoCircle className="flex-shrink-0" />
                  {errors.settlement}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center pt-8">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl hover:scale-105 transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Star className="w-6 h-6" />
              <span>{t('auth.idVerification.form.submit') || 'Submit'}</span>
              <Star className="w-6 h-6" />
            </button>
          </div>
        </form>
      </div>

<<<<<<< HEAD
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default IDVerification;
=======
      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              value={idVerificationData.firstName || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-md shadow-sm text-sm sm:text-base ${
                errors.firstName
                  ? 'border-red-500'
                  : 'border-gray-300 focus:border-[#FFD966] focus:ring-[#FFD966]'
              }`}
            />
            {errors.firstName && (
              <p className="text-xs sm:text-sm text-red-500">{errors.firstName}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Last Name *
            </label>
            <input
              type="text"
              name="lastName"
              value={idVerificationData.lastName || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-md shadow-sm text-sm sm:text-base ${
                errors.lastName
                  ? 'border-red-500'
                  : 'border-gray-300 focus:border-[#FFD966] focus:ring-[#FFD966]'
              }`}
            />
            {errors.lastName && (
              <p className="text-xs sm:text-sm text-red-500">{errors.lastName}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              ID Number *
            </label>
            <input
              type="text"
              name="idNumber"
              value={idVerificationData.idNumber || ''}
              onChange={handleChange}
              placeholder="Enter 9-digit ID number"
              className={`w-full px-3 py-2 rounded-md shadow-sm text-sm sm:text-base ${
                errors.idNumber
                  ? 'border-red-500'
                  : 'border-gray-300 focus:border-[#FFD966] focus:ring-[#FFD966]'
              }`}
            />
            {errors.idNumber && (
              <p className="text-xs sm:text-sm text-red-500">{errors.idNumber}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Date of Birth *
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={idVerificationData.dateOfBirth || ''}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              className={`w-full px-3 py-2 rounded-md shadow-sm text-sm sm:text-base ${
                errors.dateOfBirth
                  ? 'border-red-500'
                  : 'border-gray-300 focus:border-[#FFD966] focus:ring-[#FFD966]'
              }`}
            />
            {errors.dateOfBirth && (
              <p className="text-xs sm:text-sm text-red-500">{errors.dateOfBirth}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Gender *
            </label>
            <select
              name="gender"
              value={idVerificationData.gender || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-md shadow-sm text-sm sm:text-base ${
                errors.gender
                  ? 'border-red-500'
                  : 'border-gray-300 focus:border-[#FFD966] focus:ring-[#FFD966]'
              }`}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && (
              <p className="text-xs sm:text-sm text-red-500">{errors.gender}</p>
            )}
          </div>

          {/* Settlement Dropdown */}
          <div className="space-y-1 sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Settlement *
            </label>
            {loadingSettlements ? (
              <div className="flex items-center gap-2 text-gray-500">
                <FaSpinner className="animate-spin" />
                <span>Loading settlements...</span>
              </div>
            ) : settlementsError ? (
              <div className="text-red-500 flex items-center gap-1">
                <FaInfoCircle />
                <span>Failed to load settlements. Please try again later.</span>
              </div>
            ) : (
              <select
                name="settlement"
                value={idVerificationData.settlement || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-md shadow-sm text-sm sm:text-base ${
                  errors.settlement
                    ? 'border-red-500'
                    : 'border-gray-300 focus:border-[#FFD966] focus:ring-[#FFD966]'
                }`}
              >
                <option value="">Select settlement</option>
                {settlements.map(settlement => (
                  <option key={settlement.id || settlement} value={settlement.id || settlement}>
                    {settlement.name || settlement}
                  </option>
                ))}
              </select>
            )}
            {errors.settlement && (
              <p className="text-xs sm:text-sm text-red-500">{errors.settlement}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm sm:text-base font-medium"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
     );
    };
    
    export default IDVerification;
>>>>>>> e5c8af25d6cd5e0b1108cfba295b3e37060ceb90
