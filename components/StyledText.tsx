import React from 'react';
import { Text, TextProps } from 'react-native';

interface AnthropicTextProps extends TextProps {
  type?: 'heading' | 'subheading' | 'body' | 'note' | 'caption';
  className?: string;
}

export const StyledText = ({ 
  type = 'body', 
  className = '', 
  children, 
  ...props 
}: AnthropicTextProps) => {
  
  // Logic based on your .windsurfrules: 
  // Headings (24pt+) use Poppins, Body uses Lora
  const typeClasses = {
    heading: "font-heading text-2xl text-brand-dark font-bold", // 24pt+ headings
    subheading: "font-heading text-xl text-brand-dark font-semibold", // 20pt subheadings
    body: "font-body text-base text-brand-dark", // 16pt body text with Lora
    note: "font-body text-sm text-brand-mid italic", // 14pt notes with mid gray
    caption: "font-body text-xs text-brand-light-gray", // 12pt captions with light gray
  };

  return (
    <Text 
      className={`${typeClasses[type]} ${className}`} 
      {...props}
    >
      {children}
    </Text>
  );
};
