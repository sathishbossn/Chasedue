import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Image,
} from 'react-native';

const { width } = Dimensions.get('window');
const isWide = width > 900;

interface HeroProps {
  onGetStarted: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  const features = [
    {
      icon: '💸',
      label: 'Expense Tracking',
      headline: 'Track Every Rupee',
      desc: 'Categorize expenses automatically. Know exactly where your money goes.',
      mockLines: [
        { name: 'Canva Pro', cat: 'Design', amt: '₹4,000', color: '#FF006E' },
        { name: 'AWS Hosting', cat: 'Tech', amt: '₹2,200', color: '#5EEAD4' },
        { name: 'Travel', cat: 'Transport', amt: '₹800', color: '#666666' },
      ],
      mockType: 'expense',
      accent: '#FF006E',
    },
    {
      icon: '🧾',
      label: 'GST Invoices',
      headline: 'GST Invoices in Seconds',
      desc: 'Create GST-compliant invoices. Auto-calculate CGST, SGST, IGST.',
      mockLines: [
        { name: 'INVOICE #INV-042', cat: '', amt: '₹18,000', color: '#FF006E' },
        { name: 'GST @ 18%', cat: '', amt: '₹3,240', color: '#AAAAAA' },
        { name: 'Total', cat: '', amt: '₹21,240', color: '#5EEAD4' },
      ],
      mockType: 'invoice',
      accent: '#5EEAD4',
    },
    {
      icon: '💬',
      label: 'WhatsApp Integration',
      headline: 'Send Invoices on WhatsApp',
      desc: 'Coming Soon — share invoices on the channel your clients already use.',
      mockLines: [
        { name: 'Hi! Invoice #042 for ₹15,000 ready', cat: 'sent', amt: '', color: '#25D366' },
        { name: 'Thanks! Paying now 👍', cat: 'reply', amt: '', color: '#FFFFFF' },
      ],
      mockType: 'whatsapp',
      accent: '#25D366',
    },
    {
      icon: '📊',
      label: 'Analytics Dashboard',
      headline: 'Real-Time Insights',
      desc: 'Revenue trends, top clients, expense breakdowns — all live.',
      mockLines: [
        { name: 'Revenue', cat: '↑ +18%', amt: '₹45,200', color: '#22C55E' },
        { name: 'Expenses', cat: '↓ -5%', amt: '₹12,800', color: '#FF006E' },
        { name: 'Net Profit', cat: '', amt: '₹32,400', color: '#5EEAD4' },
      ],
      mockType: 'analytics',
      accent: '#22C55E',
    },
    {
      icon: '📁',
      label: 'CSV Export',
      headline: 'Export for Your CA',
      desc: 'Download all expenses and invoices as CSV. Tax time made easy.',
      mockLines: [
        { name: 'expenses_march_2026.csv', cat: '142 rows', amt: '↓', color: '#5EEAD4' },
        { name: 'invoices_q1_2026.csv', cat: '38 rows', amt: '↓', color: '#FF006E' },
        { name: 'gst_report_2026.csv', cat: '12 rows', amt: '↓', color: '#22C55E' },
      ],
      mockType: 'csv',
      accent: '#5EEAD4',
    },
    {
      icon: '👥',
      label: 'Client Management',
      headline: 'Manage All Your Clients',
      desc: 'Track clients, projects, and payments in one clean dashboard.',
      mockLines: [
        { name: 'Acme Corp', cat: '3 invoices', amt: '₹54,000', color: '#FF006E' },
        { name: 'TechStart', cat: '1 invoice', amt: '₹18,000', color: '#5EEAD4' },
        { name: 'DesignCo', cat: '2 invoices', amt: '₹36,000', color: '#22C55E' },
      ],
      mockType: 'clients',
      accent: '#22C55E',
    },
  ];

  const slides = [
    {
      image: require('../assets/images/slide1.jpeg'),
      label: 'Expense Tracking',
      caption: 'Track every rupee automatically',
      accent: '#FF006E',
    },
    {
      image: require('../assets/images/slide2.jpeg'),
      label: 'Analytics Dashboard',
      caption: 'Real-time financial insights',
      accent: '#22C55E',
    },
    {
      image: require('../assets/images/slide3.jpeg'),
      label: 'WhatsApp Integration',
      caption: 'Send invoices on WhatsApp',
      accent: '#25D366',
    },
    {
      image: require('../assets/images/slide4.jpeg'),
      label: 'GST Invoices',
      caption: 'GST-compliant invoices in seconds',
      accent: '#5EEAD4',
    },
    {
      image: require('../assets/images/slide5.jpeg'),
      label: 'Client Management',
      caption: 'Manage clients and projects',
      accent: '#FF006E',
    },
  ];

  const [activeFeature, setActiveFeature] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const [activeSlide, setActiveSlide] = useState(0);
  const [nextSlide, setNextSlide] = useState(1);
  const imageFade = useRef(new Animated.Value(1)).current;
  const imageScale = useRef(new Animated.Value(1.05)).current;
  const captionFade = useRef(new Animated.Value(1)).current;
  const captionSlide = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -20,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setActiveFeature(prev => (prev + 1) % features.length);
        slideAnim.setValue(20);
        // Fade in
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Progress bar animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 3500,
      useNativeDriver: false,
    }).start();

    const interval = setInterval(() => {
      // Fade out current image + caption
      Animated.parallel([
        Animated.timing(imageFade, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(imageScale, {
          toValue: 1.08,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(captionFade, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(captionSlide, {
          toValue: 10,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setActiveSlide(prev => {
          const next = (prev + 1) % slides.length;
          setNextSlide((next + 1) % slides.length);
          return next;
        });
        imageScale.setValue(1.02);
        captionSlide.setValue(-10);
        progressAnim.setValue(0);

        // Fade in new image + caption
        Animated.parallel([
          Animated.timing(imageFade, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(imageScale, {
            toValue: 1.05,
            duration: 3500,
            useNativeDriver: true,
          }),
          Animated.timing(captionFade, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(captionSlide, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(progressAnim, {
            toValue: 1,
            duration: 3500,
            useNativeDriver: false,
          }),
        ]).start();
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const feature = features[activeFeature];
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Left Side - Hero Content */}
        <View style={styles.leftContent}>
          <Text style={styles.headline}>
            Small Business Finance That Works For You
          </Text>
          
          <Text style={styles.subheadline}>
            Track expenses, send GST invoices, collect payments — 
            built for Indian solopreneurs who mean business.
          </Text>

          {/* Badge Pills */}
          <View style={styles.badgesContainer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>🇮🇳 GST Ready</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>⚡ WhatsApp Invoicing</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>🔒 Google Sign-In</Text>
            </View>
          </View>

          {/* CTA Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.primaryButton} onPress={onGetStarted}>
              <Text style={styles.primaryButtonText}>Try Free for 30 Days</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.secondaryButton} onPress={onGetStarted}>
              <Text style={styles.secondaryButtonText}>See a Demo</Text>
            </TouchableOpacity>
          </View>

          {/* Feature Label Bar */}
          <View style={{ 
            flexDirection: 'row', 
            flexWrap: 'wrap',
            gap: 8, 
            marginTop: 32,
            marginBottom: 0,
            justifyContent: isWide ? 'flex-start' : 'center'
          }}>
            {features.map((f, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => setActiveFeature(i)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 20,
                  backgroundColor: activeFeature === i ? f.accent : '#1A1A1A',
                  borderWidth: 1,
                  borderColor: activeFeature === i ? f.accent : '#2A2A2A',
                }}
              >
                <Text style={{ 
                  fontSize: 12, 
                  fontWeight: '600',
                  color: activeFeature === i ? '#0D0D0D' : '#AAAAAA'
                }}>
                  {f.icon} {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Feature Showcase */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              marginTop: 40,
              backgroundColor: '#1A1A1A',
              borderRadius: 16,
              borderWidth: 1,
              borderColor: feature.accent,
              padding: 20,
              width: '100%',
              maxWidth: isWide ? 520 : '100%',
            }}
          >
            {/* Feature header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 }}>
              <Text style={{ fontSize: 20 }}>{feature.icon}</Text>
              <Text style={{ fontSize: 13, fontWeight: '700', color: feature.accent, 
                textTransform: 'uppercase', letterSpacing: 1 }}>
                {feature.label}
              </Text>
              {activeFeature === 2 && (
                <View style={{ backgroundColor: '#5EEAD4', borderRadius: 4, 
                  paddingHorizontal: 8, paddingVertical: 2, marginLeft: 4 }}>
                  <Text style={{ fontSize: 10, fontWeight: '700', color: '#0D0D0D' }}>COMING SOON</Text>
                </View>
              )}
            </View>

            {/* Headline */}
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#FFFFFF', marginBottom: 6 }}>
              {feature.headline}
            </Text>

            {/* Description */}
            <Text style={{ fontSize: 13, color: '#AAAAAA', lineHeight: 20, marginBottom: 16 }}>
              {feature.desc}
            </Text>

            {/* Mock UI rows */}
            <View style={{ backgroundColor: '#0D0D0D', borderRadius: 10, padding: 14, gap: 10 }}>
              {feature.mockLines.map((line, i) => (
                <View key={i} style={{ 
                  flexDirection: 'row', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  paddingBottom: i < feature.mockLines.length - 1 ? 10 : 0,
                  borderBottomWidth: i < feature.mockLines.length - 1 ? 1 : 0,
                  borderBottomColor: '#1A1A1A',
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                    <View style={{ 
                      width: 6, height: 6, borderRadius: 3, 
                      backgroundColor: line.color 
                    }} />
                    <Text style={{ fontSize: 13, color: '#FFFFFF', fontWeight: '500', flex: 1 }}>
                      {line.name}
                    </Text>
                  </View>
                  {line.cat !== '' && (
                    <Text style={{ fontSize: 11, color: '#AAAAAA', marginHorizontal: 8 }}>
                      {line.cat}
                    </Text>
                  )}
                  {line.amt !== '' && (
                    <Text style={{ fontSize: 13, fontWeight: '700', color: line.color }}>
                      {line.amt}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </Animated.View>

          {/* Progress Dots */}
          <View style={{ 
            flexDirection: 'row', 
            gap: 6, 
            marginTop: 16,
            justifyContent: isWide ? 'flex-start' : 'center'
          }}>
            {features.map((_, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => setActiveFeature(i)}
                style={{
                  width: activeFeature === i ? 24 : 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: activeFeature === i ? features[i].accent : '#2A2A2A',
                }}
              />
            ))}
          </View>
        </View>

        {/* Right Side - Photo Slideshow */}
        {isWide && (
          <View style={styles.rightContent}>
            
            {/* Main Photo Container */}
            <View style={styles.slideContainer}>
              
              {/* Photo with fade + scale */}
              <Animated.View style={{
                opacity: imageFade,
                transform: [{ scale: imageScale }],
                width: '100%',
                height: '100%',
                borderRadius: 20,
                overflow: 'hidden',
              }}>
                <Image
                  source={slides[activeSlide].image}
                  style={styles.slideImage}
                  resizeMode="cover"
                />
                {/* Dark gradient overlay */}
                <View style={styles.slideOverlay} />
              </Animated.View>

              {/* Caption overlay at bottom */}
              <Animated.View style={[styles.captionBox, {
                opacity: captionFade,
                transform: [{ translateY: captionSlide }],
              }]}>
                <View style={[styles.captionAccentBar, 
                  { backgroundColor: slides[activeSlide].accent }]} 
                />
                <Text style={styles.captionLabel}>
                  {slides[activeSlide].label}
                </Text>
                <Text style={styles.captionText}>
                  {slides[activeSlide].caption}
                </Text>
              </Animated.View>

              {/* Progress bar at bottom */}
              <View style={styles.progressBarBg}>
                <Animated.View style={[styles.progressBarFill, {
                  backgroundColor: slides[activeSlide].accent,
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                }]} />
              </View>

              {/* Dot indicators top right */}
              <View style={styles.dotsContainer}>
                {slides.map((s, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => setActiveSlide(i)}
                    style={[
                      styles.dot,
                      {
                        backgroundColor: activeSlide === i
                          ? slides[i].accent
                          : 'rgba(255,255,255,0.3)',
                        width: activeSlide === i ? 20 : 6,
                      }
                    ]}
                  />
                ))}
              </View>

              {/* Feature label badge top left */}
              <View style={[styles.featureBadge, 
                { borderColor: slides[activeSlide].accent }]}>
                <View style={[styles.featureDot, 
                  { backgroundColor: slides[activeSlide].accent }]} />
                <Text style={[styles.featureBadgeText, 
                  { color: slides[activeSlide].accent }]}>
                  {slides[activeSlide].label}
                </Text>
              </View>

            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0D0D0D',
    paddingHorizontal: isWide ? 80 : 40,
    paddingVertical: isWide ? 120 : 80,
  },
  content: {
    flexDirection: isWide ? 'row' : 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: isWide ? 80 : 60,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  leftContent: {
    flex: 1,
    alignItems: isWide ? 'flex-start' : 'center',
    textAlign: isWide ? 'left' : 'center',
  },
  headline: {
    fontSize: isWide ? 48 : 32,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: isWide ? 56 : 40,
    marginBottom: 24,
    textAlign: isWide ? 'left' : 'center',
  },
  subheadline: {
    fontSize: 18,
    color: '#AAAAAA',
    lineHeight: 28,
    marginBottom: 32,
    textAlign: isWide ? 'left' : 'center',
    maxWidth: isWide ? 600 : '100%',
  },
  badgesContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 40,
    flexWrap: 'wrap',
    justifyContent: isWide ? 'flex-start' : 'center',
  },
  badge: {
    backgroundColor: '#1A1A1A',
    borderColor: '#2A2A2A',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 12,
    color: '#AAAAAA',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: isWide ? 'row' : 'column',
    gap: 16,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#FF006E',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 200,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderColor: '#444444',
    borderWidth: 1,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 200,
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  rightContent: {
    flex: 1,
    alignItems: 'center',
  },
  dashboardCard: {
    backgroundColor: '#1A1A1A',
    borderColor: '#FF006E',
    borderWidth: 1,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  dashboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  dashboardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  liveText: {
    fontSize: 12,
    color: '#AAAAAA',
    fontWeight: '600',
  },
  metricsContainer: {
    marginBottom: 24,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  metricLabel: {
    fontSize: 14,
    color: '#AAAAAA',
    fontWeight: '500',
  },
  metricValueRevenue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5EEAD4',
  },
  metricValueExpenses: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF006E',
  },
  metricValueProfit: {
    fontSize: 16,
    fontWeight: '700',
    color: '#22C55E',
  },
  chartContainer: {
    marginBottom: 20,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    height: 90,
  },
  bar: {
    width: 24,
    borderRadius: 4,
  },
  barPink: {
    backgroundColor: '#FF006E',
  },
  barTeal: {
    backgroundColor: '#5EEAD4',
  },
  syncTag: {
    alignItems: 'center',
  },
  syncText: {
    fontSize: 12,
    color: '#AAAAAA',
    fontWeight: '500',
  },
  slideContainer: {
    width: '100%',
    height: 420,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  slideImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  slideOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '55%',
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  captionBox: {
    position: 'absolute',
    bottom: 48,
    left: 20,
    right: 20,
  },
  captionAccentBar: {
    width: 32,
    height: 3,
    borderRadius: 2,
    marginBottom: 8,
  },
  captionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
    opacity: 1,
  },
  captionText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 24,
  },
  progressBarBg: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  progressBarFill: {
    height: 3,
    borderRadius: 2,
  },
  dotsContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  featureBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  featureBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
});

export default Hero;
