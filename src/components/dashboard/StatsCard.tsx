'use client';

import { useRef } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { Card, CardBody } from '@/components/ui/Card';
import { LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  variant?: 'default' | 'legendary' | 'exotic' | 'ascended';
}

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5
    }
  }
};

const iconVariants = {
  rest: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.15,
    rotate: 5,
    transition: { duration: 0.3 }
  }
};

const valueVariants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: { duration: 0.3 }
  }
};

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  variant = 'default'
}: StatsCardProps) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });
  const variantStyles = {
    default: 'from-primary-500/20 to-primary-600/10',
    legendary: 'from-legendary/20 to-legendary/10 legendary-glow',
    exotic: 'from-exotic/20 to-exotic/10 exotic-glow',
    ascended: 'from-ascended/20 to-ascended/10 ascended-glow',
  };

  const iconStyles = {
    default: 'text-primary-400',
    legendary: 'text-legendary',
    exotic: 'text-exotic',
    ascended: 'text-ascended',
  };

  const valueStyles = {
    default: 'text-gray-100',
    legendary: 'text-legendary text-glow',
    exotic: 'text-exotic text-glow',
    ascended: 'text-ascended text-glow',
  };

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      whileHover="hover"
      whileTap={{ scale: 0.97 }}
      style={{ minHeight: '120px' }} // Prevent layout shift
    >
      <Card className="glass group overflow-hidden relative h-full">
        {/* Background gradient overlay */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${variantStyles[variant]}`}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />

        <CardBody className="flex items-center gap-4 relative z-10">
          {/* Icon with glow effect */}
          <motion.div
            className={`p-3 rounded-lg bg-gradient-to-br ${variantStyles[variant]}`}
            variants={iconVariants}
          >
            <Icon className={`w-8 h-8 ${iconStyles[variant]} drop-shadow-[0_0_8px_currentColor]`} />
          </motion.div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <motion.p
              className="text-sm text-gray-400 font-medium"
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              transition={{ delay: 0.1 }}
            >
              {title}
            </motion.p>
            <motion.p
              className={`text-3xl font-bold ${valueStyles[variant]}`}
              variants={valueVariants}
              layout
            >
              {value}
            </motion.p>
            {description && (
              <motion.p
                className="text-xs text-gray-500 mt-1"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.2 }}
              >
                {description}
              </motion.p>
            )}
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
