import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { portfolioService } from '../services/portfolioService';
import { Portfolio } from '../types/blocks';
import { TemplateRenderer } from '../components/TemplateRenderer';
import { universalShare } from '../utils/sharingUtils';

const Container = styled.div`
  min-height: 100vh;
  background: white;
  
  /* Mobile optimization */
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const Header = styled.div`
  padding: 1rem 2rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background: white;
  position: sticky;
  top: 0;
  z-index: 100;
  
  /* Mobile optimization */
  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
  }
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
  
  /* Mobile optimization */
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ShareButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryHover};
  }
  
  /* Mobile optimization */
  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
  }
  
  /* Touch-friendly tap targets */
  @media (pointer: coarse) {
    min-height: 44px;
    min-width: 44px;
  }
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
  
  /* Mobile optimization */
  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem 0.75rem;
  }
`;

const PortfolioHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  
  /* Mobile optimization */
  @media (max-width: 768px) {
    margin-bottom: 2.5rem;
  }
`;

const ArtistName = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
  line-height: 1.2;
  
  /* Mobile optimization */
  @media (max-width: 768px) {
    font-size: 2.25rem;
    margin-bottom: 0.75rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.875rem;
  }
`;

const ArtistBio = styled.p`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.textSecondary};
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
  
  /* Mobile optimization */
  @media (max-width: 768px) {
    font-size: 1.1rem;
    line-height: 1.5;
    padding: 0 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
    padding: 0 0.5rem;
  }
`;

const PortfolioContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4rem;
  
  /* Mobile optimization */
  @media (max-width: 768px) {
    gap: 2.5rem;
  }
  
  @media (max-width: 480px) {
    gap: 2rem;
  }
`;



const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50vh;
  font-size: 1.2rem;
  color: ${props => props.theme.colors.textSecondary};
  padding: 2rem;
  
  /* Mobile optimization */
  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 1rem;
  }
`;

const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  text-align: center;
  padding: 2rem;
  
  /* Mobile optimization */
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ErrorTitle = styled.h2`
  font-size: 2rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
  
  /* Mobile optimization */
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ErrorText = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.1rem;
  
  /* Mobile optimization */
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export const PublicPortfolioPage: React.FC = () => {
  const { portfolioId } = useParams<{ portfolioId: string }>();
  const [isLoading, setIsLoading] = React.useState(true);
  const [portfolio, setPortfolio] = React.useState<Portfolio | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchPortfolio = async () => {
      if (!portfolioId) {
        setError('Portfolio ID not provided');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        // Try to fetch by public URL first, then by ID
        let portfolioData: Portfolio;
        try {
          portfolioData = await portfolioService.getPublicPortfolioByUrl(portfolioId);
        } catch {
          portfolioData = await portfolioService.getPublicPortfolioById(portfolioId);
        }
        
        setPortfolio(portfolioData);
      } catch (err) {
        console.error('Error fetching portfolio:', err);
        setError('Portfolio not found or not published');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolio();
  }, [portfolioId]);

  const handleShare = async () => {
    if (!portfolio) return;

    const shareData = {
      title: portfolio.title || `${portfolio.user?.name || 'Artist'}'s Portfolio`,
      text: `Check out ${portfolio.user?.name || 'this artist'}'s portfolio`,
      url: window.location.href,
      imageUrl: metaData.imageUrl,
    };

    await universalShare(shareData);
  };

  // Generate SEO meta data
  const getMetaData = () => {
    if (!portfolio) return {};

    const title = portfolio.title || `${portfolio.user?.name || 'Artist'}'s Portfolio`;
    const description = portfolio.user?.bio || `Explore ${portfolio.user?.name || 'this artist'}'s creative portfolio`;
    const url = window.location.href;
    
    // Get first image from blocks for Open Graph image
    let imageUrl = '';
    for (const block of portfolio.blocks || []) {
      if (block.type === 'images' && block.data.mediaFileIds?.length > 0) {
        // Use the first media file as the preview image
        const mediaFile = portfolio.mediaFiles?.find(mf => mf.id === block.data.mediaFileIds[0]);
        if (mediaFile) {
          imageUrl = mediaFile.urls.desktop || mediaFile.urls.original;
          break;
        }
      }
    }

    return {
      title,
      description,
      url,
      imageUrl,
    };
  };

  const metaData = getMetaData();

  if (isLoading) {
    return (
      <Container>
        <LoadingState>Loading portfolio...</LoadingState>
      </Container>
    );
  }

  if (error || !portfolio) {
    return (
      <Container>
        <ErrorState>
          <ErrorTitle>Portfolio Not Found</ErrorTitle>
          <ErrorText>
            The portfolio you're looking for doesn't exist or has been removed.
          </ErrorText>
        </ErrorState>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        {/* Basic SEO Meta Tags */}
        <title>{metaData.title}</title>
        <meta name="description" content={metaData.description} />
        <meta name="keywords" content="portfolio, artist, designer, creative, artwork" />
        <meta name="author" content={portfolio?.user?.name || 'Artist'} />
        
        {/* Open Graph Meta Tags for Social Sharing */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={metaData.title} />
        <meta property="og:description" content={metaData.description} />
        <meta property="og:url" content={metaData.url} />
        <meta property="og:site_name" content="Designer Portfolio Platform" />
        {metaData.imageUrl && <meta property="og:image" content={metaData.imageUrl} />}
        {metaData.imageUrl && <meta property="og:image:width" content="1200" />}
        {metaData.imageUrl && <meta property="og:image:height" content="630" />}
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaData.title} />
        <meta name="twitter:description" content={metaData.description} />
        {metaData.imageUrl && <meta name="twitter:image" content={metaData.imageUrl} />}
        
        {/* WeChat-specific Meta Tags */}
        <meta name="wechat:card" content="summary_large_image" />
        <meta name="wechat:title" content={metaData.title} />
        <meta name="wechat:description" content={metaData.description} />
        {metaData.imageUrl && <meta name="wechat:image" content={metaData.imageUrl} />}
        
        {/* Mobile Optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={metaData.url} />
      </Helmet>
      
      <Container>
        <Header>
          <HeaderContent>
            <Logo>Portfolio Platform</Logo>
            <ShareButton onClick={handleShare}>Share</ShareButton>
          </HeaderContent>
        </Header>
        
        <Content>
          <PortfolioHeader>
            <ArtistName>{portfolio.user?.name || 'Artist'}</ArtistName>
            {portfolio.user?.bio && <ArtistBio>{portfolio.user.bio}</ArtistBio>}
          </PortfolioHeader>
          
          <PortfolioContent>
            <TemplateRenderer 
              template={portfolio.template}
              blocks={portfolio.blocks || []}
              isEditing={false}
            />
          </PortfolioContent>
        </Content>
      </Container>
    </>
  );
};