<?xml version="1.0" encoding="utf-8"?>
<!--
	Author: Rob Rohan
	File:
	Date: 
	Purpose: transform an svn log file into a 9ne release file
-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="text" indent="no" encoding="utf-8" />
	
	<xsl:template match="/">
		<xsl:apply-templates select="/log/logentry" />
	</xsl:template>
	
	<xsl:template match="logentry">
		<xsl:text>[</xsl:text><xsl:value-of select="date" /> (<xsl:value-of select="@revision" />)]
		<xsl:call-template name="NEWLINE" />
		<xsl:value-of select="msg" />
		<xsl:call-template name="NEWLINE" />
		<xsl:call-template name="NEWLINE" />
		<xsl:apply-templates select="paths" />
		<xsl:call-template name="NEWLINE" />
	</xsl:template>
	
	<xsl:template match="paths">
		<xsl:apply-templates select="path" />
	</xsl:template>
	
	<xsl:template match="path">
		<xsl:call-template name="TAB" /><xsl:text>[</xsl:text><xsl:value-of select="@action" />]<xsl:call-template name="TAB" /><xsl:value-of select="." />
		<xsl:call-template name="NEWLINE" />
	</xsl:template>
	
	
	<xsl:template name="NEWLINE">
		<xsl:text>
</xsl:text>
	</xsl:template>
	
	<xsl:template name="TAB">
		<xsl:text>	</xsl:text>
	</xsl:template>
	
</xsl:stylesheet>