<?xml version="1.0" encoding="ISO-8859-1" ?>
<html xsl:version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<script language="javascript">
		function showhide(id)
		{
			if (document.getElementById(id).style.display == "none" )
				document.getElementById(id).style.display = "";
			else
				document.getElementById(id).style.display = "none";
		}
		</script>
	</head>
	<body style="font-family:Arial,helvetica,sans-serif;font-size:10pt;background-color:white">
		<table>
			<tr>
				<td nowrap="1">
					<h2 style="margin-bottom:0px">2BA exportlog</h2>
					<xsl:value-of select="export/description" />
				</td>
				<td width="100%"></td>
				<td>
					<table border="0" cellspacing="0" cellpadding="0" style="font-family:Arial,helvetica,sans-serif;font-size:8pt;">
						<tr>
							<td nowrap="1"><b>Type export:</b></td>
							<td nowrap="1" style="padding-left:3px">
								<xsl:value-of select="export/selectiontype" />
							</td>
						</tr>
						<tr>
							<td><b>Formaat:</b></td>
							<td style="padding-left:3px"><xsl:value-of select="export/format" /></td>
						</tr>
						<tr>
							<td><b>Datum/tijd:</b></td>
							<td nowrap="1" style="padding-left:3px" >
								<xsl:value-of select="export/datetime" />
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>
		<hr/>
		<b>Inhoud van dit profiel</b>
		
		<table style="font-family:Arial,helvetica,sans-serif;font-size:10pt;background-color:white" cellspacing="1" cellpadding="1" width="100%">
				<tr style="background:#2459a5;color:white;font-weight:600">
					<td rowspan="2">Naam</td>
					<td rowspan="2">GLN</td>
					<td rowspan="2">Artikelen</td>
					<td rowspan="2">Prijzen</td>
					<td rowspan="2">Producten</td>
					<td rowspan="2">Kenmerken</td>
					<td colspan="2">Artikelen</td>
					<td colspan="2">Producten</td>
				</tr>
				<tr style="background:#2459a5;color:white;font-weight:600">
					<td>Mutaties</td>
					<td>Vervallen</td>
					<td>Mutaties</td>
					<td>Vervallen</td>
				</tr>
				
		<xsl:for-each select="export/suppliercontents">
			<tr style="background:#c0ccea;color:black;">
				<td><xsl:value-of select="name" /></td>
				<td><xsl:value-of select="GLN" /></td>
				<td><xsl:value-of select="articles" /></td>
				<td><xsl:value-of select="prices" /></td>
				<td><xsl:value-of select="products" /></td>
				<td><xsl:value-of select="features" /></td>
				<td><xsl:value-of select="artmutated" /></td>
				<td><xsl:value-of select="artdeleted" /></td>
				<td><xsl:value-of select="prodmutated" /></td>
				<td><xsl:value-of select="proddeleted" /></td>
			</tr>
		</xsl:for-each>
		</table>
		
		<hr/><br/>
		<b>Controles en aanpassingen in data</b><br/>
		
		<xsl:choose>
          <xsl:when test="export/entity" >
		  </xsl:when>
          <xsl:otherwise>
				(geen meldingen)
          </xsl:otherwise>
        </xsl:choose>

		<xsl:for-each select="export/entity">
			<div style="background:#123456;color:white" width="100%">
				<xsl:value-of select="description" />
			</div>
			<table style="font-family:Arial,helvetica,sans-serif;font-size:10pt;background-color:white" cellspacing="1" cellpadding="1" width="100%">
				<tr style="background:#2459a5;color:white;font-weight:600">
					<td>Code</td>
					<td>Omschrijving</td>
					<td>Aantal</td>
					<td>Controle type</td>
					<td>Ondernomen actie</td>
				</tr>
				<xsl:for-each select="error">
					<tr style="background:#c0ccea;color:black;">
						<xsl:attribute name="onclick"> 
							showhide('<xsl:value-of select="errorcode" />');
						</xsl:attribute>
						<xsl:attribute name="onmouseover"> 
							this.style.background='#123456';this.style.cursor='pointer';this.style.color='white';
						</xsl:attribute>
						<xsl:attribute name="onmouseout"> 
							this.style.background='#c0ccea';this.style.color='black';
						</xsl:attribute>
						
						<td><xsl:value-of select="errorcode" /></td>
						<td><xsl:value-of select="description" /></td>
						<td><xsl:value-of select="count" /></td>
						<td><xsl:value-of select="checkdescription" /></td>
						<td><xsl:value-of select="actiondescription" /></td>
					</tr>
					<tr style="display:none">
						<xsl:attribute name="id">
							<xsl:value-of select="errorcode" />
						</xsl:attribute>
						<td colspan="5" style="background:white;color:black;padding-left:32px;border-top:1px solid #66cc00;padding-top:0px;margin-top:0px">
							<table border="0" cellspacing="0" cellpadding="1" style="font-family:Arial,helvetica,sans-serif;font-size:10pt;background-color:#cde8b1;border:1px solid #66cc00" width="100%">
								<tr style="background:#66cc00;color:white">
									<td nowrap="1">Artikel- / productcode</td>
									<td nowrap="1">Leverancier</td>
									<td>GLN</td>
									<td nowrap="1">Probleemwaarde</td>
									<td></td>
								</tr>
								
								<xsl:for-each select="supplier">
								
									<xsl:for-each select="ap">
										<tr>
											<td style="border-bottom:1px solid gray; border-right:1px solid gray">
												<xsl:value-of select="code" />
											</td>
											<td style="border-bottom:1px solid gray; border-right:1px solid gray" nowrap="1">
												<xsl:value-of select="../name" />
											</td>
											<td style="border-bottom:1px solid gray; border-right:1px solid gray">
												<xsl:value-of select="../GLN" />
											</td>
											<td style="border-bottom:1px solid gray; border-right:1px solid gray"><xsl:value-of select="FieldData" /></td>
											<td width="100%" style="border-bottom:1px solid gray"></td>
										</tr>
									</xsl:for-each>
								
								</xsl:for-each>
							</table>
						</td>
					</tr>
				</xsl:for-each>
			</table>
		</xsl:for-each>
		
		<xsl:if test="export/format != 'PAB200'">
			<b>Let op:</b> Naast de uitgevoerde controles op een aantal belangrijke velden is het mogelijk dat er andere waarden (zoals bijv. de omschrijving) afgeknipt is op de lengte van uw gekozen formaat.
		</xsl:if>

	</body>
</html>
